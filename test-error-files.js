const fs = require('fs');
const path = require('path');

// Función para generar datos de factura con errores
function generateErrorTestData() {
  const testCases = [
    {
      name: 'factura_sin_numero.json',
      data: {
        entity: 'factura',
        recordCount: 1,
        data: {
          ENC: {
            // Sin NUMERO_FACTURA - causará error
            SERIE: 'A001',
            FECHA_FACTURA: '2024-01-15',
            CLIENTE: 'Cliente Test',
            TOTAL: 1000.00,
            DET: [
              {
                ID_FACTURA_DET: 1,
                NUMERO_FACTURA: 'F001', // Este sí tiene número
                SERIE: 'A001',
                PRODUCTO: 'Producto 1',
                CANTIDAD: 2,
                PRECIO: 500.00
              }
            ]
          }
        }
      }
    },
    {
      name: 'factura_datos_invalidos.json',
      data: {
        entity: 'factura',
        recordCount: 1,
        data: {
          ENC: {
            NUMERO_FACTURA: 'F002',
            SERIE: 'A001',
            FECHA_FACTURA: 'fecha-invalida', // Fecha inválida
            CLIENTE: 'Cliente Test',
            TOTAL: 'no-es-numero', // Total inválido
            DET: [
              {
                ID_FACTURA_DET: 1,
                NUMERO_FACTURA: 'F002',
                SERIE: 'A001',
                PRODUCTO: 'Producto 1',
                CANTIDAD: 'cantidad-invalida', // Cantidad inválida
                PRECIO: 500.00
              }
            ]
          }
        }
      }
    },
    {
      name: 'factura_estructura_invalida.json',
      data: {
        entity: 'factura',
        recordCount: 1,
        data: {
          // Estructura inválida - sin ENC
          NUMERO_FACTURA: 'F003',
          SERIE: 'A001',
          CLIENTE: 'Cliente Test'
        }
      }
    },
    {
      name: 'factura_detalles_vacios.json',
      data: {
        entity: 'factura',
        recordCount: 1,
        data: {
          ENC: {
            NUMERO_FACTURA: 'F004',
            SERIE: 'A001',
            FECHA_FACTURA: '2024-01-15',
            CLIENTE: 'Cliente Test',
            TOTAL: 1000.00,
            DET: [] // Detalles vacíos
          }
        }
      }
    },
    {
      name: 'factura_serie_nula.json',
      data: {
        entity: 'factura',
        recordCount: 1,
        data: {
          ENC: {
            NUMERO_FACTURA: 'F005',
            SERIE: null, // Serie nula
            FECHA_FACTURA: '2024-01-15',
            CLIENTE: 'Cliente Test',
            TOTAL: 1000.00,
            DET: [
              {
                ID_FACTURA_DET: 1,
                NUMERO_FACTURA: 'F005',
                SERIE: null,
                PRODUCTO: 'Producto 1',
                CANTIDAD: 2,
                PRECIO: 500.00
              }
            ]
          }
        }
      }
    }
  ];

  return testCases;
}

// Función para crear archivos de prueba
function createTestFiles() {
  const testCases = generateErrorTestData();
  const uploadDir = path.join(process.cwd(), 'uploads');

  // Crear directorio de uploads si no existe
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Directorio de uploads creado');
  }

  console.log('🧪 Creando archivos de prueba con errores...\n');

  testCases.forEach((testCase, index) => {
    const filePath = path.join(uploadDir, testCase.name);
    fs.writeFileSync(filePath, JSON.stringify(testCase.data, null, 2));
    
    console.log(`${index + 1}. ✅ ${testCase.name}`);
    console.log(`   📝 Descripción: ${getErrorDescription(testCase.name)}`);
    console.log(`   📁 Ruta: ${filePath}\n`);
  });

  console.log('🎯 Archivos de prueba creados exitosamente!');
  console.log('📋 Ahora puedes probar el sistema de manejo de errores:');
  console.log('   1. Sube estos archivos usando el endpoint POST /sync/upload');
  console.log('   2. Revisa los errores en GET /error-sync/pending');
  console.log('   3. Consulta archivos de error en GET /error-files/list');
  console.log('   4. Reintenta archivos individuales con POST /error-files/retry/:fileName');
  console.log('   5. Reintenta todos los archivos con POST /error-files/retry-all');
}

// Función para obtener descripción del error
function getErrorDescription(fileName) {
  const descriptions = {
    'factura_sin_numero.json': 'Factura sin número de factura (campo requerido)',
    'factura_datos_invalidos.json': 'Factura con tipos de datos inválidos',
    'factura_estructura_invalida.json': 'Factura con estructura JSON incorrecta',
    'factura_detalles_vacios.json': 'Factura sin detalles (array vacío)',
    'factura_serie_nula.json': 'Factura con serie nula'
  };
  
  return descriptions[fileName] || 'Error de prueba';
}

// Función para mostrar información del sistema
function showSystemInfo() {
  console.log('🔧 INFORMACIÓN DEL SISTEMA DE MANEJO DE ERRORES (ARCHIVOS + BD)');
  console.log('==================================================================');
  console.log('');
  console.log('📁 DIRECTORIOS:');
  console.log(`   Uploads: ${path.join(process.cwd(), 'uploads')}`);
  console.log(`   Errores: Se configurará automáticamente según el sistema operativo`);
  console.log('');
  console.log('🗄️ TABLA ERROR_SYNC:');
  console.log('   - SERIE: Serie de la factura');
  console.log('   - NUMERO_FACTURA: Número de factura');
  console.log('   - NOMBRE_ARCHIVO: Nombre del archivo JSON');
  console.log('   - ERROR: Descripción del error');
  console.log('   - ESTADO: Estado del error (PENDIENTE, RESUELTO, DESCARTADO)');
  console.log('   - FECHA_CREACION: Fecha de creación del registro');
  console.log('');
  console.log('📄 ARCHIVOS DE ERROR:');
  console.log('   - Se guardan en carpeta de errores con formato: error_{original}_{timestamp}.json');
  console.log('   - Contienen datos originales + información del error');
  console.log('   - Se pueden reintentar individualmente o en lote');
  console.log('   - Se mueven a carpeta "processed" cuando se resuelven');
  console.log('');
  console.log('🌐 ENDPOINTS DISPONIBLES:');
  console.log('');
  console.log('📊 ERROR_SYNC (Base de Datos):');
  console.log('   GET    /error-sync/pending             - Errores pendientes');
  console.log('   GET    /error-sync/all                 - Todos los errores');
  console.log('   GET    /error-sync/statistics          - Estadísticas de errores');
  console.log('   GET    /error-sync/by-factura/:serie/:numero - Errores por factura');
  console.log('   GET    /error-sync/by-archivo/:archivo - Errores por archivo');
  console.log('   POST   /error-sync/update-status/:id   - Actualizar estado');
  console.log('   POST   /error-sync/resolve/:id         - Marcar como resuelto');
  console.log('   POST   /error-sync/discard/:id         - Marcar como descartado');
  console.log('');
  console.log('📄 ERROR_FILES (Archivos JSON):');
  console.log('   GET    /error-files/list               - Listar archivos de error');
  console.log('   GET    /error-files/statistics         - Estadísticas de archivos');
  console.log('   POST   /error-files/retry/:fileName    - Reintentar archivo específico');
  console.log('   POST   /error-files/retry-all          - Reintentar todos los archivos');
  console.log('   DELETE /error-files/delete/:fileName   - Eliminar archivo de error');
  console.log('   POST   /error-files/move-to-processed/:fileName - Mover a procesados');
  console.log('   GET    /error-files/by-entity/:entity  - Filtrar por entidad');
  console.log('   GET    /error-files/by-retry-count/:count - Filtrar por reintentos');
  console.log('');
  console.log('🔄 ESTADOS DE ERROR:');
  console.log('   PENDIENTE  - Error nuevo, pendiente de revisión');
  console.log('   RESUELTO   - Error solucionado');
  console.log('   DESCARTADO - Error descartado');
  console.log('');
  console.log('📊 ESTADÍSTICAS DISPONIBLES:');
  console.log('   - Total de errores en BD');
  console.log('   - Total de archivos de error');
  console.log('   - Errores por estado');
  console.log('   - Errores por entidad');
  console.log('   - Errores por archivo (top 10)');
  console.log('   - Errores por serie (top 10)');
  console.log('   - Archivos por número de reintentos');
  console.log('');
}

// Función para mostrar ejemplos de uso
function showUsageExamples() {
  console.log('📖 EJEMPLOS DE USO:');
  console.log('===================');
  console.log('');
  console.log('1. Obtener errores pendientes (BD):');
  console.log('   curl http://localhost:3002/error-sync/pending');
  console.log('');
  console.log('2. Listar archivos de error:');
  console.log('   curl http://localhost:3002/error-files/list');
  console.log('');
  console.log('3. Obtener estadísticas de archivos:');
  console.log('   curl http://localhost:3002/error-files/statistics');
  console.log('');
  console.log('4. Reintentar archivo específico:');
  console.log('   curl -X POST http://localhost:3002/error-files/retry/error_factura_001_2024-01-15T10-30-45-123Z.json');
  console.log('');
  console.log('5. Reintentar todos los archivos:');
  console.log('   curl -X POST http://localhost:3002/error-files/retry-all');
  console.log('');
  console.log('6. Buscar errores por factura (BD):');
  console.log('   curl http://localhost:3002/error-sync/by-factura/A001/123');
  console.log('');
  console.log('7. Filtrar archivos por entidad:');
  console.log('   curl http://localhost:3002/error-files/by-entity/factura');
  console.log('');
  console.log('8. Marcar error como resuelto (BD):');
  console.log('   curl -X POST http://localhost:3002/error-sync/resolve/1');
  console.log('');
  console.log('9. Mover archivo a procesados:');
  console.log('   curl -X POST http://localhost:3002/error-files/move-to-processed/error_factura_001_2024-01-15T10-30-45-123Z.json');
  console.log('');
}

// Función principal
function main() {
  console.log('🚀 GENERADOR DE PRUEBAS PARA SISTEMA DE MANEJO DE ERRORES (ARCHIVOS + BD)');
  console.log('==========================================================================\n');

  const args = process.argv.slice(2);
  
  if (args.includes('--info') || args.includes('-i')) {
    showSystemInfo();
    return;
  }

  if (args.includes('--examples') || args.includes('-e')) {
    showUsageExamples();
    return;
  }

  if (args.includes('--help') || args.includes('-h')) {
    console.log('📖 USO:');
    console.log('   node test-error-files.js          - Crear archivos de prueba');
    console.log('   node test-error-files.js --info   - Solo mostrar información');
    console.log('   node test-error-files.js --examples - Mostrar ejemplos de uso');
    console.log('   node test-error-files.js --help   - Mostrar esta ayuda');
    return;
  }

  showSystemInfo();
  console.log('');
  
  // Crear archivos de prueba por defecto
  createTestFiles();
  
  console.log('');
  showUsageExamples();
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = {
  generateErrorTestData,
  createTestFiles,
  showSystemInfo,
  showUsageExamples
}; 