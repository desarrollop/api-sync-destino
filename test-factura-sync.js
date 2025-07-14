const fs = require('fs');
const path = require('path');

// Datos de prueba basados en la estructura que proporcionaste
const testFacturaData = {
  entity: 'factura',
  timestamp: new Date().toISOString(),
  recordCount: 1,
  data: {
    ENC: {
      ID_FACTURA_ENC: 50,
      ID_SUCURSAL: "1 ",
      SERIE: "14BZ",
      NUMERO_FACTURA: 4,
      FECHA_DE_FACTURA: "2025-06-26T17:28:58.850Z",
      USUARIO_QUE_FACTURA: "lcomunica",
      MONTO_DESCUENTO_FACT: 4,
      IVA_FACTURA: 1.7143,
      TOTAL_GENERAL: 16,
      NOMBRE_CLI_A_FACTUAR: "jua nhgggg",
      NIT_CLIEN_A_FACTURAR: "4455454",
      DIRECCION_CLI_FACTUR: "ciudad",
      ESTADO_DE_FACTURA: "I",
      CODIGO_DE_CLIENTE: 1020,
      CODIGO_VENDEDOR: 1,
      NUMERO_DE_PEDIDO: 2,
      PORC_DESCUENTO_GLOB: 0,
      FECHA_ANULACION: null,
      USUARIO_ANULACION: null,
      MOTIVO_ANULACION: null,
      CORRELATIVO: null,
      TIPO_CONTRIBUYENTE: null,
      CORR_CONTINGENCIA: null,
      ESTADO_CERTIFICACION: null,
      CORR_CONTINGENCIA_INT: null,
      DET: [
        {
          ID_FACTURA_DET: 10,
          ID_SUCURSAL: "1 ",
          SERIE: "14BZ",
          NUMERO_FACTURA: 4,
          PRODUCT0: "1026L1                   ",
          CODIGO_UNIDAD_VTA: "ST",
          CANTIDAD_VENDIDA: 1,
          CANTIDAD_DEVUELTA: null,
          COSTO_UNITARIO_PROD: 0,
          PRECIO_UNITARIO_VTA: 8,
          MONTO_DESCUENTO_DET: 2,
          MONTO_IVA: 0.8571,
          SUBTOTAL_VENTAS: 7.1429,
          SUBTOTAL_GENERAL: null,
          MONTO_DESCUENTO_LINE: null,
          CORRELATIVO_INGRESO: null
        },
        {
          ID_FACTURA_DET: 11,
          ID_SUCURSAL: "1 ",
          SERIE: "14BZ",
          NUMERO_FACTURA: 4,
          PRODUCT0: "1026L1                   ",
          CODIGO_UNIDAD_VTA: "ST",
          CANTIDAD_VENDIDA: 1,
          CANTIDAD_DEVUELTA: null,
          COSTO_UNITARIO_PROD: 0,
          PRECIO_UNITARIO_VTA: 8,
          MONTO_DESCUENTO_DET: 2,
          MONTO_IVA: 0.8571,
          SUBTOTAL_VENTAS: 7.1429,
          SUBTOTAL_GENERAL: null,
          MONTO_DESCUENTO_LINE: null,
          CORRELATIVO_INGRESO: null
        }
      ]
    }
  }
};

// Crear archivo de prueba
const fileName = `test_factura_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
const filePath = path.join(__dirname, fileName);

try {
  // Escribir archivo de prueba
  fs.writeFileSync(filePath, JSON.stringify(testFacturaData, null, 2));
  
  console.log('🧪 Archivo de prueba de factura creado:');
  console.log(`📁 Archivo: ${fileName}`);
  console.log(`📊 Tamaño: ${fs.statSync(filePath).size} bytes`);
  console.log(`🏷️ Entidad: ${testFacturaData.entity}`);
  console.log(`📈 Registros: ${testFacturaData.recordCount}`);
  console.log(`🧾 Factura: ${testFacturaData.data.ENC.NUMERO_FACTURA} - Serie: ${testFacturaData.data.ENC.SERIE}`);
  console.log(`👤 Cliente: ${testFacturaData.data.ENC.NOMBRE_CLI_A_FACTUAR}`);
  console.log(`💰 Total: ${testFacturaData.data.ENC.TOTAL_GENERAL}`);
  console.log(`📋 Detalles: ${testFacturaData.data.ENC.DET.length} items`);
  console.log('');
  console.log('💡 Para probar el procesamiento:');
  console.log('   1. Asegúrate de que el servidor esté ejecutándose');
  console.log('   2. Usa este archivo para probar el endpoint de upload');
  console.log('   3. Verifica los logs del servidor');
  console.log('');
  console.log('🔗 Endpoint de prueba:');
  console.log('   POST http://localhost:3002/api/sync/upload');
  console.log('   Content-Type: multipart/form-data');
  console.log('   file: [este archivo JSON]');

} catch (error) {
  console.error('❌ Error creando archivo de prueba:', error);
} 