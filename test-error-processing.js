const fs = require('fs');
const path = require('path');

// Función para generar un archivo de prueba con error
function generateErrorTestFile() {
  const testData = {
    entity: 'factura',
    recordCount: 1,
    data: {
      ENC: {
        // Sin NUMERO_FACTURA - esto causará un error
        SERIE: 'TEST001',
        FECHA_FACTURA: '2024-01-15',
        CLIENTE: 'Cliente de Prueba',
        TOTAL: 1500.00,
        DET: [
          {
            ID_FACTURA_DET: 1,
            NUMERO_FACTURA: 'F001', // Este sí tiene número
            SERIE: 'TEST001',
            PRODUCTO: 'Producto de Prueba',
            CANTIDAD: 3,
            PRECIO: 500.00
          }
        ]
      }
    }
  };

  return testData;
}

// Función para crear el archivo de prueba
function createErrorTestFile() {
  const testData = generateErrorTestFile();
  const uploadDir = path.join(process.cwd(), 'uploads');
  const fileName = 'test_error_processing.json';
  const filePath = path.join(uploadDir, fileName);

  // Crear directorio de uploads si no existe
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('📁 Directorio de uploads creado');
  }

  // Crear archivo de prueba
  fs.writeFileSync(filePath, JSON.stringify(testData, null, 2));
  
  console.log('🧪 Archivo de prueba creado:');
  console.log(`   📁 Ruta: ${filePath}`);
  console.log(`   📝 Descripción: Factura sin NUMERO_FACTURA en el encabezado (causará error)`);
  console.log(`   🔍 Error esperado: Error al crear la factura - No se pudo guardar en base de datos`);
  console.log('');
  console.log('📋 Pasos para probar el nuevo sistema:');
  console.log('   1. Asegúrate de que el servidor esté ejecutándose');
  console.log('   2. Sube el archivo usando: POST /sync/upload');
  console.log('   3. Verifica los errores en: GET /error-sync/pending');
  console.log('   4. Verifica los archivos de error en: GET /error-files/list');
  console.log('   5. Procesa un archivo de error: POST /error-files/retry/{fileName}');
  console.log('   6. Procesa todos los archivos: POST /error-files/process-all');
  console.log('');
  console.log('🌐 Comandos curl para probar:');
  console.log('');
  console.log('# 1. Subir archivo (reemplaza con tu ruta correcta)');
  console.log(`curl -X POST http://localhost:3002/sync/upload \\`);
  console.log(`  -F "file=@${filePath}" \\`);
  console.log(`  -F "fileName=${fileName}"`);
  console.log('');
  console.log('# 2. Verificar errores en BD');
  console.log('curl http://localhost:3002/error-sync/pending');
  console.log('');
  console.log('# 3. Verificar archivos de error');
  console.log('curl http://localhost:3002/error-files/list');
  console.log('');
  console.log('# 4. Procesar un archivo de error específico (reemplaza {fileName})');
  console.log('curl -X POST http://localhost:3002/error-files/retry/{fileName}');
  console.log('');
  console.log('# 5. Procesar todos los archivos de error');
  console.log('curl -X POST http://localhost:3002/error-files/process-all');
  console.log('');
  console.log('# 6. Ver estadísticas de errores');
  console.log('curl http://localhost:3002/error-sync/statistics');
  console.log('curl http://localhost:3002/error-files/statistics');
  console.log('');
  console.log('🎯 NUEVAS FUNCIONALIDADES:');
  console.log('   ✅ Procesamiento real de archivos de error');
  console.log('   ✅ Inserción en base de datos al reintentar');
  console.log('   ✅ Actualización de estado en tabla ERROR_SYNC');
  console.log('   ✅ Movimiento automático a carpeta processed');
  console.log('   ✅ Procesamiento masivo de todos los errores');

  return filePath;
}

// Función para mostrar información del sistema
function showSystemInfo() {
  console.log('🔧 SISTEMA DE PROCESAMIENTO DE ERRORES - VERSIÓN MEJORADA');
  console.log('==========================================================');
  console.log('');
  console.log('📋 QUÉ HACE ESTE SCRIPT:');
  console.log('   1. Crea un archivo JSON con datos de factura incompletos');
  console.log('   2. El archivo falta el campo NUMERO_FACTURA en el encabezado');
  console.log('   3. Esto causará un error al procesar');
  console.log('   4. El error se guardará en la tabla ERROR_SYNC');
  console.log('   5. El archivo se guardará en la carpeta de errores');
  console.log('   6. Al reintentar, se procesará realmente e insertará en BD');
  console.log('   7. El estado cambiará de PENDIENTE a SINCRONIZADO');
  console.log('');
  console.log('📊 RESULTADOS ESPERADOS:');
  console.log('   ✅ Archivo JSON creado en carpeta uploads');
  console.log('   ✅ Error registrado en tabla ERROR_SYNC (estado: PENDIENTE)');
  console.log('   ✅ Archivo de error creado en carpeta de errores');
  console.log('   ✅ Al reintentar: datos insertados en BD');
  console.log('   ✅ Estado actualizado a SINCRONIZADO');
  console.log('   ✅ Archivo movido a carpeta processed');
  console.log('');
  console.log('🔄 FLUJO DE PROCESAMIENTO:');
  console.log('   1. Subir archivo → Error → Guardar en ERROR_SYNC + Carpeta errores');
  console.log('   2. Reintentar archivo → Procesar datos → Insertar en BD');
  console.log('   3. Si éxito → Actualizar estado a SINCRONIZADO + Mover a processed');
  console.log('   4. Si falla → Mantener estado PENDIENTE + Actualizar error');
  console.log('');
}

// Función principal
function main() {
  console.log('🚀 GENERADOR DE PRUEBA PARA SISTEMA DE PROCESAMIENTO DE ERRORES');
  console.log('================================================================\n');

  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    showSystemInfo();
    return;
  }

  showSystemInfo();
  
  // Crear archivo de prueba
  const filePath = createErrorTestFile();
  
  console.log('🎯 Archivo de prueba listo para usar!');
  console.log(`📁 Ubicación: ${filePath}`);
}

// Ejecutar si es el archivo principal
if (require.main === module) {
  main();
}

module.exports = {
  generateErrorTestFile,
  createErrorTestFile
}; 