<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## INSTALAR YARN

```bash
$ yarn install
```

# CLONAR EL ARCHIVO .ENV.TEMPLATE
Cllonar el archivo `.env.template` y renombrearlo a `.env`, por supuesto que deben ponerlo el valor real a las variables.

# API GS_SYNC Destino

Este es el servidor destino que recibe archivos JSON de la API `api_gssync`. Está diseñado para procesar y almacenar los datos sincronizados desde el sistema origen.

## Instalación

```bash
yarn install
```

## Configuración

1. Copia el archivo `env.example` a `.env`
2. Configura las variables de entorno según tus necesidades

```env
# Configuración del servidor
PORT=3002

# Configuración de directorio de uploads
UPLOAD_DIR=./uploads

# Configuración de autenticación (opcional)
SYNC_API_KEY=your-secret-api-key
```

## Ejecución del proyecto

```bash
# Desarrollo
yarn start:dev

# Producción
yarn start:prod
```

## Endpoints Disponibles

- `GET /api/sync/health` - Health check 
- `POST /api/sync/upload` - Recibir archivos JSON
- `GET /api/sync/files` - Listar archivos recibidos
- `GET /api/sync/status` - Estado del sistema

## Pruebas

```bash
# Probar el servidor
node test-destino.js
```

## Documentación Completa

Ver `SYNC_DESTINO_README.md` para documentación detallada.

## Configuración del Cliente Origen

Para que la API `api_gssync` envíe archivos a este servidor, configura en el archivo `.env` del cliente api de origen:

```env
TARGET_SERVER_URL=http://localhost:3002
TARGET_SERVER_API_KEY=your-secret-api-key
```
