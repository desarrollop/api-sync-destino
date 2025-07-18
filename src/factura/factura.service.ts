import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { UpdateFacturaDto } from './dto/update-factura.dto';
import { FacturaEnc } from './entities/factura-enc.entity';
import { FacturaDet } from './entities/factura-det.entity';
import { ErrorSync } from './entities/error-sync.entity';
import { ErrorFileService } from './error-file.service';
import {
  FacturaSyncData,
  FacturaProcessResult,
  FacturaEncSync,
  FacturaDetSync,
  FacturaCuponSync
} from './interfaces/factura-sync.interface';
import { CuponesService } from 'src/cupones/cupones.service';

@Injectable()
export class FacturaService {
  private readonly logger = new Logger(FacturaService.name);

  constructor(
    @InjectRepository(FacturaEnc)
    private readonly facturaEncRepository: Repository<FacturaEnc>,
    @InjectRepository(FacturaDet)
    private readonly facturaDetRepository: Repository<FacturaDet>,
    @InjectRepository(ErrorSync)
    private readonly errorSyncRepository: Repository<ErrorSync>,
    private readonly errorFileService: ErrorFileService,
    private readonly cuponesService: CuponesService,
  ) { }

  // Método para guardar errores en la tabla ERROR_SYNC
  private async saveErrorToSyncTable(
    serie: string,
    numeroFactura: number,
    nombreArchivo: string,
    error: string,
    estado: string = 'PENDIENTE'
  ): Promise<void> {
    try {
      const errorSync = this.errorSyncRepository.create({
        SERIE: serie,
        NUMERO_FACTURA: numeroFactura,
        NOMBRE_ARCHIVO: nombreArchivo,
        ERROR: error,
        ESTADO: estado
      });

      await this.errorSyncRepository.save(errorSync);
      this.logger.log(`❌ Error guardado en ERROR_SYNC: ${serie}-${numeroFactura}`);
    } catch (saveError) {
      this.logger.error('Error guardando en tabla ERROR_SYNC:', saveError);
    }
  }

  // Método para procesar los datos de la factura, e insertarlos en la base de datos, ademas de guardar los errores en la tabla ERROR_SYNC y en la carpeta de errores
  async processFacturaEnc(encData: FacturaSyncData, archivoOrigen: string = 'unknown'): Promise<{ success: boolean; id?: number; message: string }> {

    try {
      this.logger.log(`📋 Procesando encabezado de factura: ${encData.ENC.NUMERO_FACTURA}`);

      // Crear nueva factura
      const newFactura = this.facturaEncRepository.create({
        ...encData.ENC,
      });
      // Guardar la factura
      const savedFactura = await this.facturaEncRepository.save(newFactura);
      this.logger.log(`✅ Factura Enc creado para la factura ${savedFactura.NUMERO_FACTURA} y serie: ${savedFactura.SERIE}`);
      // Verificar si la factura se creo correctamente
      if (!savedFactura) {
        const errorMessage = 'Error al crear la factura - No se pudo guardar en base de datos';
        this.logger.error(errorMessage);

        // Guardar error en tabla ERROR_SYNC
        await this.saveErrorToSyncTable(
          encData.ENC.SERIE,
          encData.ENC.NUMERO_FACTURA,
          archivoOrigen,
          errorMessage
        );

        // Guardar archivo JSON en carpeta de errores
        await this.errorFileService.saveErrorFile(
          archivoOrigen,
          { entity: 'factura', data: encData },
          errorMessage,
          encData.ENC.SERIE,
          encData.ENC.NUMERO_FACTURA
        );

        return {
          success: false,
          message: 'Error al crear la factura'
        };
      }
      // Procesamos los detalles de la factura
      await this.processFacturaDet(encData.ENC.DET);
      // Procesamos los cupones de la factura
      await this.processCupones(encData.ENC.CUPONES, encData.ENC.SERIE, encData.ENC.NUMERO_FACTURA);

      return {
        success: true,
        id: savedFactura.ID_FACTURA_ENC,
        message: 'Factura creada exitosamente en GS_SYNC_DESTINO'
      };


    } catch (error) {
      const errorMessage = `Error procesando factura ${encData.ENC.NUMERO_FACTURA}: ${error.message}`;
      this.logger.error('Error procesando la factura:', error);

      // Guardar error en tabla ERROR_SYNC
      await this.saveErrorToSyncTable(
        encData.ENC.SERIE,
        encData.ENC.NUMERO_FACTURA,
        archivoOrigen,
        errorMessage
      );

      // Guardar archivo JSON en carpeta de errores
      await this.errorFileService.saveErrorFile(
        archivoOrigen,
        { entity: 'factura', data: encData },
        errorMessage,
        encData.ENC.SERIE,
        encData.ENC.NUMERO_FACTURA
      );

      return {
        success: false,
        message: `Error procesando factura: ${error.message}`
      };
    }
  }

  async processCupones(cuponesData: FacturaCuponSync[], serie: string, numeroFactura: number): Promise<{ success: boolean; count: number; message: string }> {
    try {
      this.logger.log(`📋 Procesando ${cuponesData.length} cupones`);
      await this.cuponesService.insertarCupon(cuponesData, serie, numeroFactura);
      this.logger.log(`✅ ${cuponesData.length} cupones procesados`);
      return {
        success: true,
        count: cuponesData.length,
        message: `Todos los cupones procesados exitosamente (${cuponesData.length})`
      };
    } catch (error) {
      const errorMessage = `Error general procesando cupones: ${error.message}`;
      this.logger.error('Error procesando cupones:', error);
      return {
        success: false,
        count: 0,
        message: errorMessage
      };
    }
  }

  async processFacturaDet(detallesData: FacturaDetSync[], archivoOrigen: string = 'unknown'): Promise<{ success: boolean; count: number; message: string }> {
    try {
      this.logger.log(`📋 Procesando ${detallesData.length} detalles de factura`);

      let processedCount = 0;
      const errors: string[] = [];

      for (const detData of detallesData) {
        try {
          // Crear nuevo detalle
          const newDet = this.facturaDetRepository.create(detData);
          await this.facturaDetRepository.save(newDet);
          processedCount++;
        } catch (error) {
          const errorMessage = `Error procesando detalle ${detData.ID_FACTURA_DET}: ${error.message}`;
          this.logger.error(`Error procesando detalle ${detData.ID_FACTURA_DET}, de la factura ${detData.NUMERO_FACTURA} y serie ${detData.SERIE}`, error);
          errors.push(errorMessage);

          // Guardar error en tabla ERROR_SYNC para el detalle
          await this.saveErrorToSyncTable(
            detData.SERIE,
            detData.NUMERO_FACTURA,
            archivoOrigen,
            errorMessage
          );
        }
      }

      this.logger.log(`✅ ${processedCount} detalles de factura procesados`);

      return {
        success: processedCount === detallesData.length,
        count: processedCount,
        message: errors.length > 0
          ? `Procesados ${processedCount}/${detallesData.length} detalles. Errores: ${errors.join(', ')}`
          : `Todos los detalles procesados exitosamente (${processedCount})`
      };

    } catch (error) {
      const errorMessage = `Error general procesando detalles: ${error.message}`;
      this.logger.error('Error procesando detalles de factura:', error);

      // Guardar error general en tabla ERROR_SYNC
      if (detallesData.length > 0) {
        await this.saveErrorToSyncTable(
          detallesData[0].SERIE,
          detallesData[0].NUMERO_FACTURA,
          archivoOrigen,
          errorMessage
        );
      }

      return {
        success: false,
        count: 0,
        message: `Error procesando detalles: ${error.message}`
      };
    }
  }
}