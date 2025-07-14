import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { FacturaModule } from 'src/factura/factura.module';

@Module({
  imports: [ConfigModule, FacturaModule],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule { } 