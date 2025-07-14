import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { ErrorSyncController } from './error-sync.controller';
import { ErrorFileController } from './error-file.controller';
import { ErrorFileService } from './error-file.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FacturaEnc } from './entities/factura-enc.entity';
import { FacturaDet } from './entities/factura-det.entity';
import { ErrorSync } from './entities/error-sync.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FacturaEnc, FacturaDet, ErrorSync])],
  controllers: [FacturaController, ErrorSyncController, ErrorFileController],
  providers: [FacturaService, ErrorFileService],
  exports: [FacturaService, ErrorFileService],
})
export class FacturaModule { }
