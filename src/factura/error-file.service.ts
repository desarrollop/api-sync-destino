import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ErrorSync } from './entities/error-sync.entity';

@Injectable()
export class ErrorFileService {
  private readonly logger = new Logger(ErrorFileService.name);
  private readonly errorDir: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(ErrorSync)
    private readonly errorSyncRepository: Repository<ErrorSync>,
  ) {
    // Configurar directorio de errores
    this.errorDir = this.getErrorDirectory();
    this.ensureErrorDirectory();
  }

  private getErrorDirectory(): string {
    // 1. Prioridad: Variable de entorno específica
    const envErrorDir = this.configService.get<string>('ERROR_DIR');
    if (envErrorDir) {
      this.logger.log(`📁 Usando directorio de errores configurado: ${envErrorDir}`);
      return envErrorDir;
    }

    // 2. Prioridad: Variable de entorno para datos de sincronización
    const syncDataPath = this.configService.get<string>('SYNC_DATA_PATH');
    if (syncDataPath) {
      const syncErrorDir = path.join(syncDataPath, 'errors');
      this.logger.log(`📁 Usando directorio de errores de sincronización: ${syncErrorDir}`);
      return syncErrorDir;
    }

    // 3. Prioridad: Directorio del sistema operativo
    const systemErrorDir = this.getSystemErrorDirectory();
    this.logger.log(`📁 Usando directorio de errores del sistema: ${systemErrorDir}`);
    return systemErrorDir;
  }

  private getSystemErrorDirectory(): string {
    const platform = os.platform();
    const homeDir = os.homedir();

    switch (platform) {
      case 'win32':
        return path.join(homeDir, 'AppData', 'Local', 'api_gssync_destino', 'errors');
      case 'darwin':
        return path.join(homeDir, 'Library', 'Application Support', 'api_gssync_destino', 'errors');
      case 'linux':
        return path.join(homeDir, '.local', 'share', 'api_gssync_destino', 'errors');
      default:
        return path.join(os.tmpdir(), 'api_gssync_destino', 'errors');
    }
  }

  private ensureErrorDirectory() {
    if (!fs.existsSync(this.errorDir)) {
      fs.mkdirSync(this.errorDir, { recursive: true });
      this.logger.log(`📁 Directorio de errores creado: ${this.errorDir}`);

      // Crear archivo .gitkeep
      const gitkeepPath = path.join(this.errorDir, '.gitkeep');
      if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '# Este archivo mantiene la estructura del directorio de errores\n');
      }
    }
  }

  async saveErrorFile(
    originalFileName: string,
    jsonData: any,
    errorMessage: string,
    serie?: string,
    numeroFactura?: number
  ): Promise<{ success: boolean; errorFilePath?: string }> {
    try {
      // Generar nombre del archivo de error
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const baseName = path.parse(originalFileName).name;
      const errorFileName = `error_${baseName}_${timestamp}.json`;
      const errorFilePath = path.join(this.errorDir, errorFileName);

      // Crear objeto con información del error
      const errorData = {
        originalFileName,
        errorTimestamp: new Date().toISOString(),
        errorMessage,
        serie,
        numeroFactura,
        originalData: jsonData,
        retryCount: 0,
        lastRetryAttempt: null
      };

      // Guardar archivo JSON
      fs.writeFileSync(errorFilePath, JSON.stringify(errorData, null, 2));
      this.logger.log(`💾 Archivo de error guardado: ${errorFileName}`);

      return {
        success: true,
        errorFilePath
      };

    } catch (error) {
      this.logger.error('Error guardando archivo de error:', error);
      return {
        success: false
      };
    }
  }

  async getErrorFiles(): Promise<Array<{
    fileName: string;
    filePath: string;
    errorInfo: any;
    size: number;
    modified: Date;
  }>> {
    try {
      if (!fs.existsSync(this.errorDir)) {
        return [];
      }

      const files = fs.readdirSync(this.errorDir)
        .filter(file => file.endsWith('.json') && file.startsWith('error_'))
        .map(file => {
          const filePath = path.join(this.errorDir, file);
          const stats = fs.statSync(filePath);

          let errorInfo = null;
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            errorInfo = JSON.parse(content);
          } catch (error) {
            this.logger.warn(`No se pudo leer información del archivo de error: ${file}`);
          }

          return {
            fileName: file,
            filePath,
            errorInfo,
            size: stats.size,
            modified: stats.mtime
          };
        })
        .sort((a, b) => b.modified.getTime() - a.modified.getTime());

      return files;
    } catch (error) {
      this.logger.error('Error obteniendo archivos de error:', error);
      return [];
    }
  }

  async retryErrorFile(fileName: string): Promise<{ success: boolean; message: string; data?: any }> {
    try {
      const filePath = path.join(this.errorDir, fileName);

      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: `Archivo de error no encontrado: ${fileName}`
        };
      }

      // Leer archivo de error
      const content = fs.readFileSync(filePath, 'utf8');
      const errorData = JSON.parse(content);

      // Incrementar contador de reintentos
      errorData.retryCount = (errorData.retryCount || 0) + 1;
      errorData.lastRetryAttempt = new Date().toISOString();

      // Actualizar archivo con nueva información
      fs.writeFileSync(filePath, JSON.stringify(errorData, null, 2));

      this.logger.log(`🔄 Reintentando archivo: ${fileName} (intento #${errorData.retryCount})`);

      return {
        success: true,
        message: `Archivo ${fileName} listo para reintento (intento #${errorData.retryCount})`,
        data: errorData.originalData
      };

    } catch (error) {
      this.logger.error(`Error en reintento de archivo ${fileName}:`, error);
      return {
        success: false,
        message: `Error procesando archivo: ${error.message}`
      };
    }
  }

  // Método para procesar realmente el archivo de error e insertarlo en la base de datos
  async processErrorFile(fileName: string, facturaService: any): Promise<{
    success: boolean;
    message: string;
    processedData?: any;
    errorSyncUpdated?: boolean;
  }> {
    try {
      const filePath = path.join(this.errorDir, fileName);

      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: `Archivo de error no encontrado: ${fileName}`
        };
      }

      // Leer archivo de error
      const content = fs.readFileSync(filePath, 'utf8');
      const errorData = JSON.parse(content);

      this.logger.log(`🔄 Procesando archivo de error: ${fileName}`);

      // Procesar los datos originales usando el servicio de factura
      let processResult;
      if (errorData.originalData?.entity === 'factura') {
        processResult = await facturaService.processFacturaEnc(
          errorData.originalData.data,
          errorData.originalFileName
        );
      } else {
        return {
          success: false,
          message: `Tipo de entidad no soportado: ${errorData.originalData?.entity}`
        };
      }

      // Si el procesamiento fue exitoso
      if (processResult.success) {
        // Actualizar estado en la tabla ERROR_SYNC
        const errorSyncUpdated = await this.updateErrorSyncStatus(
          errorData.serie,
          errorData.numeroFactura,
          errorData.originalFileName,
          'SINCRONIZADO'
        );

        // Mover archivo a procesados
        await this.moveErrorFileToProcessed(fileName);

        this.logger.log(`✅ Archivo de error procesado exitosamente: ${fileName}`);

        return {
          success: true,
          message: `Archivo ${fileName} procesado y sincronizado exitosamente`,
          processedData: processResult,
          errorSyncUpdated
        };
      } else {
        // Si falló nuevamente, actualizar el error en ERROR_SYNC
        await this.updateErrorSyncStatus(
          errorData.serie,
          errorData.numeroFactura,
          errorData.originalFileName,
          'PENDIENTE',
          processResult.message
        );

        // Incrementar contador de reintentos
        errorData.retryCount = (errorData.retryCount || 0) + 1;
        errorData.lastRetryAttempt = new Date().toISOString();
        fs.writeFileSync(filePath, JSON.stringify(errorData, null, 2));

        return {
          success: false,
          message: `Error al procesar archivo: ${processResult.message}`,
          processedData: processResult
        };
      }

    } catch (error) {
      this.logger.error(`Error procesando archivo de error ${fileName}:`, error);
      return {
        success: false,
        message: `Error procesando archivo: ${error.message}`
      };
    }
  }

  // Método para actualizar el estado en la tabla ERROR_SYNC
  private async updateErrorSyncStatus(
    serie: string,
    numeroFactura: number,
    nombreArchivo: string,
    estado: string,
    nuevoError?: string
  ): Promise<boolean> {
    try {
      const updateResult = await this.errorSyncRepository.update(
        {
          SERIE: serie,
          NUMERO_FACTURA: numeroFactura,
          NOMBRE_ARCHIVO: nombreArchivo
        },
        {
          ESTADO: estado,
          ...(nuevoError && { ERROR: nuevoError }),
          FECHA_CREACION: new Date()
        }
      );

      if (updateResult.affected > 0) {
        this.logger.log(`✅ Estado actualizado en ERROR_SYNC: ${serie}-${numeroFactura} -> ${estado}`);
        return true;
      } else {
        this.logger.warn(`⚠️ No se encontró registro en ERROR_SYNC para actualizar: ${serie}-${numeroFactura}`);
        return false;
      }
    } catch (error) {
      this.logger.error('Error actualizando estado en ERROR_SYNC:', error);
      return false;
    }
  }

  async deleteErrorFile(fileName: string): Promise<{ success: boolean; message: string }> {
    try {
      const filePath = path.join(this.errorDir, fileName);

      if (!fs.existsSync(filePath)) {
        return {
          success: false,
          message: `Archivo de error no encontrado: ${fileName}`
        };
      }

      fs.unlinkSync(filePath);
      this.logger.log(`🗑️ Archivo de error eliminado: ${fileName}`);

      return {
        success: true,
        message: `Archivo ${fileName} eliminado exitosamente`
      };

    } catch (error) {
      this.logger.error(`Error eliminando archivo ${fileName}:`, error);
      return {
        success: false,
        message: `Error eliminando archivo: ${error.message}`
      };
    }
  }

  async moveErrorFileToProcessed(fileName: string): Promise<{ success: boolean; message: string }> {
    try {
      const sourcePath = path.join(this.errorDir, fileName);
      const processedDir = path.join(this.errorDir, 'processed');

      // Crear directorio processed si no existe
      if (!fs.existsSync(processedDir)) {
        fs.mkdirSync(processedDir, { recursive: true });
      }

      const destPath = path.join(processedDir, fileName);

      if (!fs.existsSync(sourcePath)) {
        return {
          success: false,
          message: `Archivo de error no encontrado: ${fileName}`
        };
      }

      fs.renameSync(sourcePath, destPath);
      this.logger.log(`✅ Archivo de error movido a procesados: ${fileName}`);

      return {
        success: true,
        message: `Archivo ${fileName} movido a procesados exitosamente`
      };

    } catch (error) {
      this.logger.error(`Error moviendo archivo ${fileName}:`, error);
      return {
        success: false,
        message: `Error moviendo archivo: ${error.message}`
      };
    }
  }

  async getErrorStatistics(): Promise<any> {
    try {
      const errorFiles = await this.getErrorFiles();
      const processedDir = path.join(this.errorDir, 'processed');
      const processedFiles = fs.existsSync(processedDir)
        ? fs.readdirSync(processedDir).filter(file => file.endsWith('.json')).length
        : 0;

      // Agrupar por entidad
      const errorsByEntity: { [key: string]: number } = {};
      const errorsByRetryCount: { [key: string]: number } = {};

      errorFiles.forEach(file => {
        if (file.errorInfo?.originalData?.entity) {
          const entity = file.errorInfo.originalData.entity;
          errorsByEntity[entity] = (errorsByEntity[entity] || 0) + 1;
        }

        const retryCount = file.errorInfo?.retryCount || 0;
        errorsByRetryCount[retryCount.toString()] = (errorsByRetryCount[retryCount.toString()] || 0) + 1;
      });

      return {
        totalErrorFiles: errorFiles.length,
        processedFiles,
        errorsByEntity,
        errorsByRetryCount,
        errorDirectory: this.errorDir,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.logger.error('Error obteniendo estadísticas de archivos de error:', error);
      return null;
    }
  }
} 