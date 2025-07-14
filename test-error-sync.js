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
  console.log('   3. Consulta estadísticas en GET /error-sync/statistics');
  console.log('   4. Revisa errores por factura en GET /error-sync/by-factura/:serie/:numero');
  console.log('   5. Revisa errores por archivo en GET /error-sync/by-archivo/:archivo');
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
  console.log('🔧 INFORMACIÓN DEL SISTEMA DE MANEJO DE ERRORES (ERROR_SYNC)');
  console.log('================================================================');
  console.log('');
  console.log('📁 DIRECTORIOS:');
  console.log(`   Uploads: ${path.join(process.cwd(), 'uploads')}`);
  console.log('');
  console.log('🗄️ TABLA ERROR_SYNC:');
  console.log('   - SERIE: Serie de la factura');
  console.log('   - NUMERO_FACTURA: Número de factura');
  console.log('   - NOMBRE_ARCHIVO: Nombre del archivo JSON');
  console.log('   - ERROR: Descripción del error');
  console.log('   - ESTADO: Estado del error (PENDIENTE, RESUELTO, DESCARTADO)');
  console.log('   - FECHA_CREACION: Fecha de creación del registro');
  console.log('');
  console.log('🌐 ENDPOINTS DISPONIBLES:');
  console.log('   POST   /sync/upload                    - Subir archivos JSON');
  console.log('   GET    /error-sync/pending             - Errores pendientes');
  console.log('   GET    /error-sync/all                 - Todos los errores');
  console.log('   GET    /error-sync/statistics          - Estadísticas de errores');
  console.log('   GET    /error-sync/by-factura/:serie/:numero - Errores por factura');
  console.log('   GET    /error-sync/by-archivo/:archivo - Errores por archivo');
  console.log('   POST   /error-sync/update-status/:id   - Actualizar estado');
  console.log('   POST   /error-sync/resolve/:id         - Marcar como resuelto');
  console.log('   POST   /error-sync/discard/:id         - Marcar como descartado');
  console.log('');
  console.log('🔄 ESTADOS DE ERROR:');
  console.log('   PENDIENTE  - Error nuevo, pendiente de revisión');
  console.log('   RESUELTO   - Error solucionado');
  console.log('   DESCARTADO - Error descartado');
  console.log('');
  console.log('📊 ESTADÍSTICAS DISPONIBLES:');
  console.log('   - Total de errores');
  console.log('   - Errores pendientes');
  console.log('   - Errores por estado');
  console.log('   - Errores por archivo (top 10)');
  console.log('   - Errores por serie (top 10)');
  console.log('');
}

// Función para mostrar ejemplos de uso
function showUsageExamples() {
  console.log('📖 EJEMPLOS DE USO:');
  console.log('===================');
  console.log('');
  console.log('1. Obtener errores pendientes:');
  console.log('   curl http://localhost:3002/error-sync/pending');
  console.log('');
  console.log('2. Obtener estadísticas:');
  console.log('   curl http://localhost:3002/error-sync/statistics');
  console.log('');
  console.log('3. Buscar errores por factura:');
  console.log('   curl http://localhost:3002/error-sync/by-factura/A001/123');
  console.log('');
  console.log('4. Buscar errores por archivo:');
  console.log('   curl http://localhost:3002/error-sync/by-archivo/factura_001.json');
  console.log('');
  console.log('5. Marcar error como resuelto:');
  console.log('   curl -X POST http://localhost:3002/error-sync/resolve/1');
  console.log('');
  console.log('6. Actualizar estado manualmente:');
  console.log('   curl -X POST http://localhost:3002/error-sync/update-status/1 \\');
  console.log('        -H "Content-Type: application/json" \\');
  console.log('        -d \'{"estado": "RESUELTO"}\'');
  console.log('');
}

// Función principal
function main() {
  console.log('🚀 GENERADOR DE PRUEBAS PARA SISTEMA DE MANEJO DE ERRORES (ERROR_SYNC)');
  console.log('========================================================================\n');

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
    console.log('   node test-error-sync.js          - Crear archivos de prueba');
    console.log('   node test-error-sync.js --info   - Solo mostrar información');
    console.log('   node test-error-sync.js --examples - Mostrar ejemplos de uso');
    console.log('   node test-error-sync.js --help   - Mostrar esta ayuda');
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