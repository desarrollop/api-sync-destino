const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'http://localhost:3002/api';

async function testDestinoServer() {
  console.log('🧪 Probando servidor destino...\n');

  try {
    // 1. Health check
    console.log('1. Health check:');
    const health = await axios.get(`${API_BASE_URL}/sync/health`);
    console.log(health.data);
    console.log('');

    // 2. Estado inicial
    console.log('2. Estado inicial:');
    const status = await axios.get(`${API_BASE_URL}/sync/status`);
    console.log(status.data);
    console.log('');

    // 3. Listar archivos (debería estar vacío inicialmente)
    console.log('3. Archivos recibidos:');
    const files = await axios.get(`${API_BASE_URL}/sync/files`);
    console.log(files.data);
    console.log('');

    // 4. Crear archivo de prueba
    console.log('4. Creando archivo de prueba...');
    const testData = {
      entity: 'pedidos_enc',
      timestamp: new Date().toISOString(),
      recordCount: 2,
      data: [
        {
          ID_PEDIDO_ENC: 1,
          ID_SUCURSAL: 1,
          NUMERO_DE_PEDIDO: 1001,
          FECHA_PEDIDO: new Date().toISOString(),
          USUARIO_INGRESO_PEDI: 'TEST_USER',
          SUBTOTAL_PEDIDO: 100.00,
          MONTO_DESCUENTO_PEDI: 10.00,
          IVA_PEDIDO: 12.00,
          TOTAL_GENERAL_PEDIDO: 102.00,
          ESTADO_PEDIDO: 'A',
          NOMBRE_A_FACTURAR: 'Cliente Test',
          NIT_A_FACTURAR: '12345678',
          DIRECCION_FACTURAR: 'Dirección Test',
          CODIGO_DE_CLIENTE: 1,
          CODIGO_VENDEDOR: 1,
          PORC_DESCUENTO_GLOB: 10.0,
          CODIGO_DE_BODEGA: '01'
        },
        {
          ID_PEDIDO_ENC: 2,
          ID_SUCURSAL: 1,
          NUMERO_DE_PEDIDO: 1002,
          FECHA_PEDIDO: new Date().toISOString(),
          USUARIO_INGRESO_PEDI: 'TEST_USER',
          SUBTOTAL_PEDIDO: 200.00,
          MONTO_DESCUENTO_PEDI: 20.00,
          IVA_PEDIDO: 24.00,
          TOTAL_GENERAL_PEDIDO: 204.00,
          ESTADO_PEDIDO: 'A',
          NOMBRE_A_FACTURAR: 'Cliente Test 2',
          NIT_A_FACTURAR: '87654321',
          DIRECCION_FACTURAR: 'Dirección Test 2',
          CODIGO_DE_CLIENTE: 2,
          CODIGO_VENDEDOR: 1,
          PORC_DESCUENTO_GLOB: 10.0,
          CODIGO_DE_BODEGA: '01'
        }
      ]
    };

    const fileName = `test_pedidos_enc_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    const filePath = path.join(__dirname, fileName);
    
    // Escribir archivo de prueba
    fs.writeFileSync(filePath, JSON.stringify(testData, null, 2));
    console.log(`Archivo de prueba creado: ${fileName}`);

    // 5. Simular upload (esto requeriría FormData, pero para la prueba usamos el archivo creado)
    console.log('5. Simulando upload...');
    console.log('Nota: Para probar el upload real, necesitarías usar FormData');
    console.log('Puedes usar el archivo de prueba creado manualmente');
    console.log('');

    // 6. Estado final
    console.log('6. Estado final:');
    const finalStatus = await axios.get(`${API_BASE_URL}/sync/status`);
    console.log(finalStatus.data);

    // Limpiar archivo de prueba
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`\n🧹 Archivo de prueba eliminado: ${fileName}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Asegúrate de que el servidor esté ejecutándose:');
      console.log('   yarn start:dev');
    }
  }
}

// Ejecutar prueba
testDestinoServer(); 