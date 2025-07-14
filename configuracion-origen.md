# Configuración del Servidor Origen (api_gssync)

Para que el servidor origen `api_gssync` envíe archivos a este servidor destino, sigue estos pasos:

## 1. Configurar Variables de Entorno

En el archivo `.env` del proyecto `api_gssync`, agrega estas variables:

```env
# Servidor destino para transferencia
TARGET_SERVER_URL=http://localhost:3002
TARGET_SERVER_API_KEY=your-secret-api-key
```

## 2. Verificar Configuración

Puedes verificar la configuración usando estos endpoints:

```bash
# Ver configuración de transferencia
curl http://localhost:3001/api/sync/transfer/config

# Verificar conexión con servidor destino
curl http://localhost:3001/api/sync/transfer/health
```

## 3. Probar Sincronización

Una vez configurado, puedes probar la sincronización:

```bash
# 1. Exportar pedidos
curl -X POST http://localhost:3001/api/sync/export/pedidos-enc

# 2. Ver archivos creados
curl http://localhost:3001/api/sync/files/created

# 3. Transferir todos los archivos
curl -X POST http://localhost:3001/api/sync/transfer/all

# 4. Ver estado
curl http://localhost:3001/api/sync/status
```

## 4. Verificar en Servidor Destino

En el servidor destino, puedes verificar que los archivos llegaron:

```bash
# Health check
curl http://localhost:3002/api/sync/health

# Listar archivos recibidos
curl http://localhost:3002/api/sync/files

# Estado del sistema
curl http://localhost:3002/api/sync/status
```

## 5. Flujo Completo de Prueba

### En el servidor origen (api_gssync):
```bash
# Terminal 1 - Servidor origen
cd ../api_gssync
yarn start:dev
```

### En el servidor destino (api_gssync_destino):
```bash
# Terminal 2 - Servidor destino
cd api_gssync_destino
yarn start:dev
```

### Probar sincronización:
```bash
# Terminal 3 - Pruebas
# 1. Exportar datos
curl -X POST http://localhost:3001/api/sync/export/pedidos-enc

# 2. Transferir al destino
curl -X POST http://localhost:3001/api/sync/transfer/all

# 3. Verificar en destino
curl http://localhost:3002/api/sync/files
```

## 6. Configuración de Producción

Para producción, asegúrate de:

1. **Cambiar las URLs** a las direcciones de producción
2. **Usar API keys seguras** y únicas
3. **Configurar HTTPS** si es necesario
4. **Configurar firewalls** para permitir la comunicación entre servidores

```env
# Producción
TARGET_SERVER_URL=https://tu-servidor-destino.com
TARGET_SERVER_API_KEY=tu-api-key-segura-de-produccion
```

## 7. Monitoreo

Puedes monitorear la sincronización usando:

```bash
# Estado del origen
curl http://localhost:3001/api/sync/status

# Estado del destino
curl http://localhost:3002/api/sync/status

# Logs en tiempo real
# En ambos servidores, ejecuta: yarn start:dev
```

## 8. Solución de Problemas

### Error de conexión:
- Verifica que ambos servidores estén ejecutándose
- Verifica las URLs y puertos
- Verifica la configuración de CORS

### Error de autenticación:
- Verifica que las API keys coincidan
- Verifica el formato de la API key

### Error de transferencia:
- Verifica el tamaño de los archivos
- Verifica el espacio en disco
- Revisa los logs de ambos servidores
``` 