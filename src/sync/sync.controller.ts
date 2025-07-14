import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  Res,
  HttpStatus,
  HttpException,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SyncService } from './sync.service';

@Controller('sync')
export class SyncController {
  private readonly logger = new Logger(SyncController.name);

  constructor(private readonly syncService: SyncService) { }

  @Get('health')
  async healthCheck() {
    return {
      status: 'OK',
      message: '✅ Servidor destino funcionando correctamente, se pueden sincronizar archivos',
      Fecha: new Date(),
      service: 'api_gssync_destino'
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any,
    @Res() res: Response
  ) {
    try {
      if (!file) {
        throw new HttpException(
          'No se recibió ningún archivo',
          HttpStatus.BAD_REQUEST
        );
      }

      this.logger.log(`📁 Archivo recibido: ${file.originalname}`);
      this.logger.log(`📊 Tamaño: ${file.size} bytes`);
      this.logger.log(`⏰ Timestamp: ${body.timestamp || 'No proporcionado'}`);

      // Procesar el archivo
      const result = await this.syncService.processUploadedFile(file, body);

      return res.status(HttpStatus.OK).json({
        success: true,
        message: '✅ Archivo procesado exitosamente ',
        fileName: file.originalname,
        fileSize: file.size,
        entity: result.entity,
        recordCount: result.recordCount,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      this.logger.error('❌ Error procesando archivo:', error);

      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Error interno del servidor',
        message: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  @Get('files')
  async getFiles() {
    try {
      const files = await this.syncService.getUploadedFiles();

      return {
        files,
        totalFiles: files.length,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error listando archivos:', error);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('status')
  async getStatus() {
    try {
      const status = await this.syncService.getSystemStatus();
      return {
        ...status,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      this.logger.error('Error obteniendo estado:', error);
      throw new HttpException(
        'Error interno del servidor',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
} 