import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncModule } from './sync/sync.module';
import { FacturaModule } from './factura/factura.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Configuración de la conexión a la base de datos
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT || '1433'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // Sincronización de las entidades con la base de datos
      synchronize: false,
      // Opciones de conexión a la base de datos
      options: {
        // Opciones de encriptación
        encrypt: false,
        // Opciones de confianza en el servidor
        trustServerCertificate: true,
        // Opciones de aritmética de aborto
        enableArithAbort: true
      },
      // Opciones adicionales de conexión
      extra: {
        // Opciones de confianza en el servidor
        trustServerCertificate: true,
        // Opciones de encriptación
        Encrypt: false,
        // Opciones de seguridad integrada
        IntegratedSecurity: false,
        // Opciones de tiempo de espera de conexión
        connectionTimeout: 30000
      }
    }),
    SyncModule,
    FacturaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
