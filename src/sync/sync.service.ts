import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { FacturaService } from 'src/factura/factura.service';

export interface ProcessedFileResult {
  entity: string;
  recordCount: number;
  fileName: string;
  filePath: string;
  timestamp: string;
}

export interface FileInfo {
  name: string;
  size: number;
  modified: Date;
  path: string;
  entity?: string;
  recordCount?: number;
}

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);
  private readonly uploadDir: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly facturaService: FacturaService
  ) {
    // Configurar directorio de uploads con mejor práctica
    this.uploadDir = this.getUploadDirectory();

    // Crear directorio si no existe
    this.ensureUploadDirectory();
  }

  // Obtener el directorio de uploads
  private getUploadDirectory(): string {
    // 1. Prioridad: Variable de entorno específica
    const envUploadDir = this.configService.get<string>('UPLOAD_DIR');
    if (envUploadDir) {
      this.logger.log(`📁 Usando directorio configurado: ${envUploadDir}`);
      return envUploadDir;
    }

    // 2. Prioridad: Variable de entorno para datos de sincronización
    const syncDataPath = this.configService.get<string>('SYNC_DATA_PATH');
    if (syncDataPath) {
      const syncUploadDir = path.join(syncDataPath, 'uploads');
      this.logger.log(`📁 Usando directorio de sincronización: ${syncUploadDir}`);
      return syncUploadDir;
    }

    // 3. Prioridad: Directorio del sistema operativo
    const systemUploadDir = this.getSystemUploadDirectory();
    this.logger.log(`📁 Usando directorio del sistema: ${systemUploadDir}`);
    return systemUploadDir;
  }

  // Obtener el directorio de uploads del sistema operativo
  private getSystemUploadDirectory(): string {
    const platform = os.platform();
    const homeDir = os.homedir();

    switch (platform) {
      case 'win32':
        // Windows: C:\Users\{Usuario}\AppData\Local\api_gssync_destino\uploads
        return path.join(homeDir, 'AppData', 'Local', 'api_gssync_destino', 'uploads');

      case 'darwin':
        // macOS: ~/Library/Application Support/api_gssync_destino/uploads
        return path.join(homeDir, 'Library', 'Application Support', 'api_gssync_destino', 'uploads');

      case 'linux':
        // Linux: ~/.local/share/api_gssync_destino/uploads
        return path.join(homeDir, '.local', 'share', 'api_gssync_destino', 'uploads');

      default:
        // Fallback: directorio temporal del sistema
        return path.join(os.tmpdir(), 'api_gssync_destino', 'uploads');
    }
  }

  // Crear el directorio de uploads si no existe
  private ensureUploadDirectory() {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
      this.logger.log(`📁 Directorio de uploads creado: ${this.uploadDir}`);

      // Crear archivo .gitkeep para mantener la estructura
      const gitkeepPath = path.join(this.uploadDir, '.gitkeep');
      if (!fs.existsSync(gitkeepPath)) {
        fs.writeFileSync(gitkeepPath, '# Este archivo mantiene la estructura del directorio\n');
      }
    }
  }

  // Procesar el archivo subido
  async processUploadedFile(
    file: Express.Multer.File,
    body: any
  ): Promise<ProcessedFileResult> {
    try {
      // Obtener el nombre del archivo y la ruta de guardado
      const fileName = file.originalname;
      const filePath = path.join(this.uploadDir, fileName);

      // Guardar el archivo en el directorio de uploads
      fs.writeFileSync(filePath, file.buffer);

      this.logger.log(`💾 Archivo guardado: ${filePath}`);

      // Leer y procesar el contenido JSON del archivo
      const fileContent = fs.readFileSync(filePath, 'utf8');
      // Parsear el contenido JSON del archivo
      const jsonData = JSON.parse(fileContent);

      this.logger.log(`🏷️ Entidad: ${jsonData.entity}`);
      this.logger.log(`📈 Registros: ${jsonData.recordCount}`);

      // TODO: Implementar la lógica específica para procesar cada tipo de entidad, ya depende de lo que quieran hacer lol, XD
      await this.processEntityData(jsonData, fileName);

      return {
        entity: jsonData.entity,
        recordCount: jsonData.recordCount,
        fileName,
        filePath,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      this.logger.error('Error procesando archivo:', error);
      throw new Error(`Error procesando archivo: ${error.message}`);
    }
  }

  // Implementar la lógica específica para  procesar cada tipo de entidad, ya depende de lo que quieran hacer lol, XD
  private async processEntityData(jsonData: any, fileName: string) {
    const { entity, data, recordCount } = jsonData;

    this.logger.log(`🔄 Procesando entidad: ${entity}`);
    this.logger.log(`📊 Registros a procesar: ${recordCount}`);

    // Implementar lógica específica por entidad
    switch (entity) {
      case 'factura':
        await this.facturaService.processFacturaEnc(data, fileName);
        break;
      case 'pedidos_enc':
        // ejemplo de como se podria procesar una entidad distinta a la que se esta procesando en este momento, serviria para futuras entidades
        await this.processPedidosEnc(data);
        break;
      default:
        this.logger.warn(`❓ Entidad no reconocida: ${entity}`);
        // Guardar datos sin procesar específicamente
        await this.saveUnprocessedData(entity, data);
    }
  }

  // Métodos específicos para cada entidad
  private async processPedidosEnc(data: any[]) {
    this.logger.log('📋 Procesando pedidos encabezados...');
    // Aquí implementarías la lógica para insertar/actualizar pedidos encabezados
    // Por ejemplo: await this.pedidosEncRepository.save(data);
    this.logger.log(`✅ ${data.length} pedidos encabezados procesados`);
    console.log(data);
  }



  // Guardar los datos no procesados
  private async saveUnprocessedData(entity: string, data: any[]) {
    this.logger.log(`💾 Guardando datos no procesados para entidad: ${entity}`);
    // Aquí podríamos guardar en una tabla de datos no procesados, pero no lo haremos por ahora, solo dejamos el log
    // await this.unprocessedDataRepository.save({ entity, data, timestamp: new Date() });
  }

  // Obtener los archivos subidos
  async getUploadedFiles(): Promise<FileInfo[]> {
    try {
      if (!fs.existsSync(this.uploadDir)) {
        return [];
      }

      const files = fs.readdirSync(this.uploadDir)
        .filter(file => file.endsWith('.json'))
        .map(file => {
          const filePath = path.join(this.uploadDir, file);
          const stats = fs.statSync(filePath);

          // Intentar leer información del archivo JSON
          let entity: string | undefined;
          let recordCount: number | undefined;

          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const jsonData = JSON.parse(content);
            entity = jsonData.entity;
            recordCount = jsonData.recordCount;
          } catch (error) {
            this.logger.warn(`No se pudo leer información del archivo: ${file}`);
          }

          return {
            name: file,
            size: stats.size,
            modified: stats.mtime,
            path: filePath,
            entity,
            recordCount
          };
        });

      return files;
    } catch (error) {
      this.logger.error('Error obteniendo archivos:', error);
      throw new Error(`Error obteniendo archivos: ${error.message}`);
    }
  }

  // Obtener el estado del sistema
  async getSystemStatus() {
    try {
      const files = await this.getUploadedFiles();
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);

      return {
        uploadDirectory: this.uploadDir,
        totalFiles: files.length,
        totalSize: `${(totalSize / 1024 / 1024).toFixed(2)} MB`,
        entities: this.getEntitySummary(files),
        lastUpload: files.length > 0 ? files[0].modified : null,
        systemInfo: {
          nodeVersion: process.version,
          platform: process.platform,
          uptime: process.uptime()
        }
      };
    } catch (error) {
      this.logger.error('Error obteniendo estado del sistema:', error);
      throw new Error(`Error obteniendo estado: ${error.message}`);
    }
  }

  // Obtener el resumen de las entidades
  private getEntitySummary(files: FileInfo[]) {
    const entityCount: { [key: string]: number } = {};

    files.forEach(file => {
      if (file.entity) {
        entityCount[file.entity] = (entityCount[file.entity] || 0) + 1;
      }
    });

    return entityCount;
  }
} 