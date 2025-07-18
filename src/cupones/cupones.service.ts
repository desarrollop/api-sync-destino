import { Injectable, Logger } from '@nestjs/common';
import { CreateCuponesDto } from './dto/create-cupone.dto';
import { Cupones } from './entities/cupone.entity';
import { Repository, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CuponesService {
  private readonly logger = new Logger(CuponesService.name);
  constructor(
    @InjectRepository(Cupones)
    private readonly cuponesRepository: Repository<Cupones>,
  ) { }

  // Insertamos los cupones de la sincronizacion de facturas
  async insertarCupon(createCuponesDto: CreateCuponesDto[], SERIE: string, NUMERO_FACTURA: number) {
    if (!createCuponesDto || createCuponesDto.length === 0) {
      this.logger.log('📝 No hay cupones para insertar');
      return [];
    }

    this.logger.log(`🚀 Iniciando inserción directa de ${createCuponesDto.length} cupones`);

    // Crear objetos planos para inserción más rápida
    const cuponesParaInsertar = createCuponesDto.map(dto => ({
      NUMERO_CUPON: dto.NUMERO_CUPON,
      NUMERO_PEDIDO: dto.NUMERO_PEDIDO,
      ID_SUCURSAL: dto.SUCURSAL,
      VENDEDOR_APLICA: dto.VENDEDOR_APLICA,
      FECHA_APLICACION: dto.FECHA,
      SERIE: SERIE,
      NUMERO_FACTURA: NUMERO_FACTURA
    }));

    const mapeoTime = Date.now();
    try {
      // Inserción directa sin validación de duplicados
      const resultado = await this.cuponesRepository.insert(cuponesParaInsertar);

      const totalTime = Date.now();
      this.logger.log(`✅ Insertados ${resultado.identifiers.length} cupones en ${totalTime - mapeoTime}ms`);

      return cuponesParaInsertar;
    } catch (error) {
      // Si hay error de duplicado, la base de datos lo manejará
      this.logger.warn(`⚠️ Error en inserción (posible duplicado): ${error.message}`);
      return [];
    }
  }
}
