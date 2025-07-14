import { Controller, Get, Post, Param, Delete } from '@nestjs/common';
import { ErrorFileService } from './error-file.service';
import { FacturaService } from './factura.service';

@Controller('error-files')
export class ErrorFileController {
  constructor(
    private readonly errorFileService: ErrorFileService,
    private readonly facturaService: FacturaService
  ) { }

  @Get('list')
  async getErrorFiles() {
    try {
      const files = await this.errorFileService.getErrorFiles();
      return {
        success: true,
        data: files,
        count: files.length,
        message: `Se encontraron ${files.length} archivos de error`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error obteniendo archivos de error: ${error.message}`
      };
    }
  }

  @Get('statistics')
  async getErrorStatistics() {
    try {
      const stats = await this.errorFileService.getErrorStatistics();
      return {
        success: true,
        data: stats,
        message: 'Estadísticas de archivos de error obtenidas exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: `Error obteniendo estadísticas: ${error.message}`
      };
    }
  }

  @Post('retry/:fileName')
  async retryErrorFile(@Param('fileName') fileName: string) {
    try {
      // Usar el nuevo método que realmente procesa el archivo e inserta en la BD
      const processResult = await this.errorFileService.processErrorFile(fileName, this.facturaService);

      return {
        success: processResult.success,
        message: processResult.message,
        data: processResult.processedData,
        errorSyncUpdated: processResult.errorSyncUpdated
      };

    } catch (error) {
      return {
        success: false,
        message: `Error en reintento: ${error.message}`
      };
    }
  }

  // Procesar todos los archivos de error e insertarlos en la base de datos
  @Post('process-all')
  async processAllErrorFiles() {
    try {
      const files = await this.errorFileService.getErrorFiles();
      const results = [];

      for (const file of files) {
        try {
          const result = await this.errorFileService.processErrorFile(file.fileName, this.facturaService);
          results.push({
            fileName: file.fileName,
            success: result.success,
            message: result.message,
            errorSyncUpdated: result.errorSyncUpdated
          });
        } catch (error) {
          results.push({
            fileName: file.fileName,
            success: false,
            message: `Error: ${error.message}`,
            errorSyncUpdated: false
          });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      const errorSyncUpdated = results.filter(r => r.errorSyncUpdated).length;

      return {
        success: true,
        data: {
          totalFiles: files.length,
          successful,
          failed,
          errorSyncUpdated,
          results
        },
        message: `Procesamiento completado: ${successful} exitosos, ${failed} fallidos, ${errorSyncUpdated} estados actualizados`
      };

    } catch (error) {
      return {
        success: false,
        message: `Error en procesamiento masivo: ${error.message}`
      };
    }
  }

  // reintentar todos los archivos de error, se debe hacer en un bucle para que se vayan reintentando uno por uno, y se debe guardar el resultado de cada reintento en la tabla ERROR_SYNC
  @Post('retry-all')
  async retryAllErrorFiles() {
    try {
      const files = await this.errorFileService.getErrorFiles();
      const results = [];

      for (const file of files) {
        try {
          const result = await this.retryErrorFile(file.fileName);
          results.push({
            fileName: file.fileName,
            success: result.success,
            message: result.message
          });
        } catch (error) {
          results.push({
            fileName: file.fileName,
            success: false,
            message: `Error: ${error.message}`
          });
        }
      }

      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;

      return {
        success: true,
        data: {
          totalFiles: files.length,
          successful,
          failed,
          results
        },
        message: `Reintento completado: ${successful} exitosos, ${failed} fallidos`
      };

    } catch (error) {
      return {
        success: false,
        message: `Error en reintento masivo: ${error.message}`
      };
    }
  }

  @Delete('delete/:fileName')
  async deleteErrorFile(@Param('fileName') fileName: string) {
    try {
      const result = await this.errorFileService.deleteErrorFile(fileName);
      return {
        success: result.success,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        message: `Error eliminando archivo: ${error.message}`
      };
    }
  }

  @Post('move-to-processed/:fileName')
  async moveErrorFileToProcessed(@Param('fileName') fileName: string) {
    try {
      const result = await this.errorFileService.moveErrorFileToProcessed(fileName);
      return {
        success: result.success,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        message: `Error moviendo archivo: ${error.message}`
      };
    }
  }

  @Get('by-entity/:entity')
  async getErrorFilesByEntity(@Param('entity') entity: string) {
    try {
      const files = await this.errorFileService.getErrorFiles();
      const filteredFiles = files.filter(file =>
        file.errorInfo?.originalData?.entity === entity
      );

      return {
        success: true,
        data: filteredFiles,
        count: filteredFiles.length,
        message: `Se encontraron ${filteredFiles.length} archivos de error para entidad: ${entity}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error obteniendo archivos por entidad: ${error.message}`
      };
    }
  }

  @Get('by-retry-count/:count')
  async getErrorFilesByRetryCount(@Param('count') count: string) {
    try {
      const files = await this.errorFileService.getErrorFiles();
      const retryCount = parseInt(count);
      const filteredFiles = files.filter(file =>
        (file.errorInfo?.retryCount || 0) === retryCount
      );

      return {
        success: true,
        data: filteredFiles,
        count: filteredFiles.length,
        message: `Se encontraron ${filteredFiles.length} archivos con ${retryCount} reintentos`
      };
    } catch (error) {
      return {
        success: false,
        message: `Error obteniendo archivos por reintentos: ${error.message}`
      };
    }
  }
} 