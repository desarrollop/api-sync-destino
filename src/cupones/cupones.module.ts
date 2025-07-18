import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CuponesService } from './cupones.service';
import { CuponesController } from './cupones.controller';
import { Cupones } from './entities/cupone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cupones])],
  controllers: [CuponesController],
  providers: [CuponesService],
  exports: [CuponesService],
})
export class CuponesModule { }
