# Servidor Destino - API GS_SYNC

## Descripción

Este es el servidor destino que recibe archivos JSON de la API `api_gssync`. Está diseñado para procesar y almacenar los datos sincronizados desde el sistema origen.

## Configuración

### 1. Variables de Entorno

Copia el archivo `env.example` a `.env` y configura las variables:

```env
# Configuración del servidor
PORT=3002

# Configuración de directorio de uploads (OPCIONAL)
UPLOAD_DIR=C:\sync-data\uploads

# Configuración de directorio de sincronización (OPCIONAL)
SYNC_DATA_PATH=C:\sync-data

# Configuración de autenticación (opcional)
SYNC_API_KEY=your-secret-api-key
```

### 2. Configuración de Directorios

El sistema tiene **3 niveles de configuración** para el directorio de uploads:

#### **Nivel 1: UPLOAD_DIR (Prioridad más alta)**
```env
UPLOAD_DIR=C:\sync-data\uploads
```
- Configuración específica para uploads
- Se usa exactamente como se especifica

#### **Nivel 2: SYNC_DATA_PATH (Prioridad media)**
```env
SYNC_DATA_PATH=C:\sync-data
```
- Directorio base para todos los datos de sincronización
- Los uploads se guardarán en: `SYNC_DATA_PATH/uploads`

#### **Nivel 3: Automático (Prioridad más baja)**
Si no configuras ninguna variable, el sistema usará automáticamente:

- **Windows**: `C:\Users\{Usuario}\AppData\Local\api_gssync_destino\uploads`
- **macOS**: `~/Library/Application Support/api_gssync_destino/uploads`
- **Linux**: `~/.local/share/api_gssync_destino/uploads`

### 3. Recomendaciones por Entorno

#### **Desarrollo:**
```env
# No configurar nada - usar directorio automático
PORT=3002
SYNC_API_KEY=dev-key
```

#### **Producción Windows:**
```env
PORT=3002
UPLOAD_DIR=C:\sync-data\uploads
SYNC_API_KEY=production-key-secure
```

#### **Producción Linux/macOS:**
```env
PORT=3002
UPLOAD_DIR=/var/sync-data/uploads
SYNC_API_KEY=production-key-secure
```

### 4. Instalación

```bash
yarn install
```

### 5. Ejecución

```bash
# Desarrollo
yarn start:dev

# Producción
yarn start:prod
```

## Endpoints Disponibles

### Health Check
```http
GET /api/sync/health
```
Verifica que el servidor esté funcionando correctamente.

**Respuesta:**
```json
{
  "status": "OK",
  "message": "Servidor destino funcionando correctamente",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "service": "api_gssync_destino"
}
```

### Upload de Archivos
```http
POST /api/sync/upload
Content-Type: multipart/form-data
```

**Parámetros:**
- `file`: Archivo JSON a procesar
- `fileName`: Nombre del archivo (opcional)
- `timestamp`: Timestamp de la transferencia (opcional)
- `apiKey`: Clave de autenticación (opcional)

**Respuesta:**
```json
{
  "success": true,
  "message": "Archivo procesado exitosamente",
  "fileName": "pedidos_enc_2024-01-15T10-30-45-123Z.json",
  "fileSize": 15420,
  "entity": "pedidos_enc",
  "recordCount": 150,
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Listar Archivos
```http
GET /api/sync/files
```
Lista todos los archivos recibidos y procesados.

**Respuesta:**
```json
{
  "files": [
    {
      "name": "pedidos_enc_2024-01-15T10-30-45-123Z.json",
      "size": 15420,
      "modified": "2024-01-15T10:30:45.123Z",
      "path": "C:\\sync-data\\uploads\\pedidos_enc_2024-01-15T10-30-45-123Z.json",
      "entity": "pedidos_enc",
      "recordCount": 150
    }
  ],
  "totalFiles": 1,
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

### Estado del Sistema
```http
GET /api/sync/status
```
Muestra el estado completo del sistema de sincronización.

**Respuesta:**
```json
{
  "uploadDirectory": "C:\\sync-data\\uploads",
  "totalFiles": 5,
  "totalSize": "2.45 MB",
  "entities": {
    "pedidos_enc": 3,
    "clientes": 1,
    "vendedor": 1
  },
  "lastUpload": "2024-01-15T10:30:45.123Z",
  "systemInfo": {
    "nodeVersion": "v18.17.0",
    "platform": "win32",
    "uptime": 3600
  },
  "timestamp": "2024-01-15T10:30:45.123Z"
}
```

## Entidades Soportadas

El servidor puede procesar las siguientes entidades:

1. **pedidos_enc** - Encabezados de pedidos
2. **pedidos_det** - Detalles de pedidos
3. **clientes** - Información de clientes
4. **vendedor** - Información de vendedores
5. **sucursales** - Información de sucursales
6. **bodegas** - Información de bodegas
7. **fel_empresa** - Empresas FEL
8. **fel_establecimiento** - Establecimientos FEL
9. **fel_establecimiento_series** - Series de establecimientos FEL

## Estructura de Datos Esperada

Los archivos JSON deben tener la siguiente estructura:

```json
{
  "entity": "pedidos_enc",
  "timestamp": "2024-01-15T10:30:45.123Z",
  "recordCount": 150,
  "data": [
    {
      "ID_PEDIDO_ENC": 1,
      "ID_SUCURSAL": 1,
      "NUMERO_DE_PEDIDO": 1001,
      "FECHA_PEDIDO": "2024-01-15T10:30:45.123Z",
      // ... resto de campos
    }
  ]
}
```

## Flujo de Procesamiento

1. **Recepción**: El archivo se recibe vía HTTP multipart/form-data
2. **Validación**: Se valida que el archivo sea JSON válido
3. **Almacenamiento**: El archivo se guarda en el directorio configurado
4. **Procesamiento**: Se procesa según el tipo de entidad
5. **Respuesta**: Se retorna confirmación del procesamiento

## Configuración del Cliente Origen

Para que la API `api_gssync` envíe archivos a este servidor, configura estas variables en el archivo `.env` del cliente:

```env
TARGET_SERVER_URL=http://localhost:3002
TARGET_SERVER_API_KEY=your-secret-api-key
```

## Logs

El sistema registra todas las operaciones. Puedes ver los logs ejecutando:

```bash
yarn start:dev
```

Ejemplo de logs:
```
📁 Usando directorio del sistema: C:\Users\Usuario\AppData\Local\api_gssync_destino\uploads
📁 Directorio de uploads creado: C:\Users\Usuario\AppData\Local\api_gssync_destino\uploads
🚀 Servidor destino ejecutándose en puerto 3002
📁 Archivo recibido: pedidos_enc_2024-01-15T10-30-45-123Z.json
📊 Tamaño: 15420 bytes
💾 Archivo guardado: C:\Users\Usuario\AppData\Local\api_gssync_destino\uploads\pedidos_enc_2024-01-15T10-30-45-123Z.json
🏷️ Entidad: pedidos_enc
📈 Registros: 150
🔄 Procesando entidad: pedidos_enc
📋 Procesando pedidos encabezados...
✅ 150 pedidos encabezados procesados
```

## Ventajas de la Nueva Configuración

### **Separación de Responsabilidades:**
- ✅ **Código vs Datos**: El proyecto no se contamina con archivos temporales
- ✅ **Escalabilidad**: Los datos pueden crecer sin afectar el proyecto
- ✅ **Despliegues limpios**: No se incluyen archivos de datos en builds

### **Flexibilidad:**
- ✅ **Configuración por entorno**: Diferentes ubicaciones para dev/prod
- ✅ **Compatibilidad multiplataforma**: Funciona en Windows, macOS y Linux
- ✅ **Configuración automática**: No requiere configuración manual

### **Mantenimiento:**
- ✅ **Backups independientes**: Los datos se pueden respaldar por separado
- ✅ **Limpieza fácil**: Los archivos no interfieren con el código
- ✅ **Monitoreo**: Mejor control del espacio en disco

## Próximos Pasos

Para completar la implementación, considera:

1. **Base de Datos**: Integrar TypeORM para persistir los datos
2. **Autenticación**: Implementar middleware de autenticación
3. **Validación**: Agregar validación específica por entidad
4. **Monitoreo**: Implementar métricas y alertas
5. **Backup**: Sistema de respaldo de archivos procesados
6. **Limpieza**: Programar limpieza automática de archivos antiguos

## Pruebas

Para probar el servidor, puedes usar el archivo `test-destino.js` del proyecto origen o usar curl:

```bash
# Health check
curl http://localhost:3002/api/sync/health

# Listar archivos
curl http://localhost:3002/api/sync/files

# Estado del sistema
curl http://localhost:3002/api/sync/status
``` 