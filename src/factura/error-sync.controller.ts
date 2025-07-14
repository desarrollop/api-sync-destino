import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorSync } from './entities/error-sync.entity';

@Controller('error-sync')
export class ErrorSyncController {
  constructor(
    @InjectRepository(ErrorSync)
    private readonly errorSyncRepository: Repository<ErrorSync>
  ) { }

  @Get('pending')
  async getPendingErrors() {
    try {
      const errors = await this.errorSyncRepository.find({
        where: { ESTADO: 'PENDIENTE' },
        order: { FECHA_CREACION: 'DESC' }
      });

      return {
        success: true,
        data: errors,
        count: errors.length,
        message: `Se encontraron ${errors.length} errores pendientes`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error obteniendo errores pendientes: ${error.message}`
      };
    }
  }

  @Get('all')
  async getAllErrors() {
    try {
      const errors = await this.errorSyncRepository.find({
        order: { FECHA_CREACION: 'DESC' }
      });

      return {
        success: true,
        data: errors,
        count: errors.length,
        message: `Se encontraron ${errors.length} errores en total`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error obteniendo errores: ${error.message}`
      };
    }
  }

  @Get('by-factura/:serie/:numero')
  async getErrorsByFactura(
    @Param('serie') serie: string,
    @Param('numero') numero: string
  ) {
    try {
      const errors = await this.errorSyncRepository.find({
        where: {
          SERIE: serie,
          NUMERO_FACTURA: parseInt(numero)
        },
        order: { FECHA_CREACION: 'DESC' }
      });

      return {
        success: true,
        data: errors,
        count: errors.length,
        message: `Se encontraron ${errors.length} errores para factura ${serie}-${numero}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error obteniendo errores por factura: ${error.message}`
      };
    }
  }

  @Get('by-archivo/:archivo')
  async getErrorsByArchivo(@Param('archivo') archivo: string) {
    try {
      const errors = await this.errorSyncRepository.find({
        where: { NOMBRE_ARCHIVO: archivo },
        order: { FECHA_CREACION: 'DESC' }
      });

      return {
        success: true,
        data: errors,
        count: errors.length,
        message: `Se encontraron ${errors.length} errores para archivo ${archivo}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error obteniendo errores por archivo: ${error.message}`
      };
    }
  }

  @Post('update-status/:id')
  async updateErrorStatus(
    @Param('id') id: string,
    @Body() body: { estado: string }
  ) {
    try {
      const result = await this.errorSyncRepository.update(
        parseInt(id),
        { ESTADO: body.estado }
      );

      if (result.affected > 0) {
        return {
          success: true,
          message: `Estado del error ${id} actualizado a: ${body.estado}`
        };
      } else {
        return {
          success: false,
          message: `Error no encontrado con ID: ${id}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error actualizando estado: ${error.message}`
      };
    }
  }

  @Get('statistics')
  async getErrorStatistics() {
    try {
      const totalErrors = await this.errorSyncRepository.count();
      const pendingErrors = await this.errorSyncRepository.count({
        where: { ESTADO: 'PENDIENTE' }
      });

      // Errores por estado
      const errorsByStatus = await this.errorSyncRepository
        .createQueryBuilder('error')
        .select('error.ESTADO', 'estado')
        .addSelect('COUNT(*)', 'count')
        .groupBy('error.ESTADO')
        .getRawMany();

      // Errores por archivo
      const errorsByFile = await this.errorSyncRepository
        .createQueryBuilder('error')
        .select('error.NOMBRE_ARCHIVO', 'archivo')
        .addSelect('COUNT(*)', 'count')
        .groupBy('error.NOMBRE_ARCHIVO')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      // Errores por serie
      const errorsBySerie = await this.errorSyncRepository
        .createQueryBuilder('error')
        .select('error.SERIE', 'serie')
        .addSelect('COUNT(*)', 'count')
        .groupBy('error.SERIE')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany();

      return {
        success: true,
        data: {
          totalErrors,
          pendingErrors,
          errorsByStatus,
          errorsByFile,
          errorsBySerie,
          timestamp: new Date().toISOString()
        },
        message: 'Estadísticas de errores obtenidas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error obteniendo estadísticas: ${error.message}`
      };
    }
  }

  @Post('resolve/:id')
  async resolveError(@Param('id') id: string) {
    try {
      const result = await this.errorSyncRepository.update(
        parseInt(id),
        { ESTADO: 'RESUELTO' }
      );

      if (result.affected > 0) {
        return {
          success: true,
          message: `Error ${id} marcado como resuelto`
        };
      } else {
        return {
          success: false,
          message: `Error no encontrado con ID: ${id}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error resolviendo error: ${error.message}`
      };
    }
  }

  @Post('discard/:id')
  async discardError(@Param('id') id: string) {
    try {
      const result = await this.errorSyncRepository.update(
        parseInt(id),
        { ESTADO: 'DESCARTADO' }
      );

      if (result.affected > 0) {
        return {
          success: true,
          message: `Error ${id} marcado como descartado`
        };
      } else {
        return {
          success: false,
          message: `Error no encontrado con ID: ${id}`
        };
      }
    } catch (error) {
      return {
        success: false,
        message: `Error descartando error: ${error.message}`
      };
    }
  }
} 