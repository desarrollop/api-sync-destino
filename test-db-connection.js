const sql = require('mssql');

// Configuración de la base de datos
const config = {
  user: process.env.DB_USERNAME || 'sa',
  password: process.env.DB_PASSWORD || 'F787TNcorp',
  server: process.env.DB_HOST || '186.189.218.179',
  database: process.env.DB_NAME || 'GS_SYNC_DESTINO',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

async function testDatabaseConnection() {
  try {
    console.log('🔌 Probando conexión a la base de datos...');
    console.log('📋 Configuración:', {
      server: config.server,
      database: config.database,
      user: config.user
    });

    // Conectar a la base de datos
    const pool = await sql.connect(config);
    console.log('✅ Conexión exitosa a la base de datos');

    // Verificar si la tabla ERROR_SYNC existe
    console.log('\n📋 Verificando tabla ERROR_SYNC...');
    const tableCheck = await pool.request()
      .query(`
        SELECT TABLE_NAME 
        FROM INFORMATION_SCHEMA.TABLES 
        WHERE TABLE_NAME = 'ERROR_SYNC'
      `);

    if (tableCheck.recordset.length > 0) {
      console.log('✅ Tabla ERROR_SYNC encontrada');
      
      // Verificar estructura de la tabla
      const structureCheck = await pool.request()
        .query(`
          SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
          FROM INFORMATION_SCHEMA.COLUMNS 
          WHERE TABLE_NAME = 'ERROR_SYNC'
          ORDER BY ORDINAL_POSITION
        `);
      
      console.log('\n📊 Estructura de la tabla ERROR_SYNC:');
      structureCheck.recordset.forEach(col => {
        console.log(`   - ${col.COLUMN_NAME}: ${col.DATA_TYPE} (${col.IS_NULLABLE === 'YES' ? 'NULL' : 'NOT NULL'})`);
      });

      // Intentar insertar un registro de prueba
      console.log('\n🧪 Insertando registro de prueba...');
      const insertResult = await pool.request()
        .input('serie', sql.NVarChar, 'TEST')
        .input('numeroFactura', sql.BigInt, 999999)
        .input('nombreArchivo', sql.NVarChar, 'test_file.json')
        .input('error', sql.Text, 'Error de prueba para verificar funcionamiento')
        .input('estado', sql.NVarChar, 'PENDIENTE')
        .query(`
          INSERT INTO ERROR_SYNC (SERIE, NUMERO_FACTURA, NOMBRE_ARCHIVO, ERROR, ESTADO, FECHA_CREACION)
          VALUES (@serie, @numeroFactura, @nombreArchivo, @error, @estado, GETDATE())
        `);

      console.log('✅ Registro de prueba insertado exitosamente');

      // Verificar el registro insertado
      const verifyResult = await pool.request()
        .input('serie', sql.NVarChar, 'TEST')
        .input('numeroFactura', sql.BigInt, 999999)
        .query(`
          SELECT TOP 1 * FROM ERROR_SYNC 
          WHERE SERIE = @serie AND NUMERO_FACTURA = @numeroFactura
          ORDER BY FECHA_CREACION DESC
        `);

      if (verifyResult.recordset.length > 0) {
        const record = verifyResult.recordset[0];
        console.log('\n📄 Registro insertado:');
        console.log(`   - ID: ${record.ID}`);
        console.log(`   - SERIE: ${record.SERIE}`);
        console.log(`   - NUMERO_FACTURA: ${record.NUMERO_FACTURA}`);
        console.log(`   - NOMBRE_ARCHIVO: ${record.NOMBRE_ARCHIVO}`);
        console.log(`   - ERROR: ${record.ERROR}`);
        console.log(`   - ESTADO: ${record.ESTADO}`);
        console.log(`   - FECHA_CREACION: ${record.FECHA_CREACION}`);
      }

      // Limpiar registro de prueba
      console.log('\n🧹 Limpiando registro de prueba...');
      await pool.request()
        .input('serie', sql.NVarChar, 'TEST')
        .input('numeroFactura', sql.BigInt, 999999)
        .query(`
          DELETE FROM ERROR_SYNC 
          WHERE SERIE = @serie AND NUMERO_FACTURA = @numeroFactura
        `);
      
      console.log('✅ Registro de prueba eliminado');

    } else {
      console.log('❌ Tabla ERROR_SYNC no encontrada');
      console.log('💡 Asegúrate de que la tabla existe en la base de datos');
    }

    await pool.close();
    console.log('\n🎉 Prueba completada exitosamente');

  } catch (error) {
    console.error('❌ Error en la prueba:', error);
    console.error('💡 Verifica la configuración de la base de datos');
  }
}

// Función para mostrar información de ayuda
function showHelp() {
  console.log('🔧 SCRIPT DE PRUEBA DE CONEXIÓN A BASE DE DATOS');
  console.log('================================================');
  console.log('');
  console.log('📋 USO:');
  console.log('   node test-db-connection.js');
  console.log('');
  console.log('📋 VARIABLES DE ENTORNO REQUERIDAS:');
  console.log('   DB_HOST     - Servidor de base de datos (default: localhost)');
  console.log('   DB_PORT     - Puerto de base de datos (default: 1433)');
  console.log('   DB_USERNAME - Usuario de base de datos (default: sa)');
  console.log('   DB_PASSWORD - Contraseña de base de datos (default: 123456)');
  console.log('   DB_NAME     - Nombre de la base de datos (default: GS_SYNC_DESTINO)');
  console.log('');
  console.log('📋 QUÉ HACE ESTE SCRIPT:');
  console.log('   1. Conecta a la base de datos');
  console.log('   2. Verifica que la tabla ERROR_SYNC existe');
  console.log('   3. Muestra la estructura de la tabla');
  console.log('   4. Inserta un registro de prueba');
  console.log('   5. Verifica que el registro se insertó correctamente');
  console.log('   6. Limpia el registro de prueba');
  console.log('');
}

// Verificar argumentos
const args = process.argv.slice(2);
if (args.includes('--help') || args.includes('-h')) {
  showHelp();
} else {
  testDatabaseConnection();
} 