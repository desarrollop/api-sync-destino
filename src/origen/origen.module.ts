import { Module } from '@nestjs/common';
import { OrigenService } from './origen.service';
import { OrigenController } from './origen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SyncMaestroProductos } from './entities/productos.entity';
import { SyncPreciosProductos } from './entities/precios.entity';
import { SyncVendedores } from './entities/vendedores.entity';
import { SyncProductosAlternos } from './entities/codigosBarra.entity';
import { SyncListaCuponesEnc } from './entities/cuponesEnc.entity';
import { SyncListaCuponesDet } from './entities/cuponesDet.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SyncMaestroProductos,
      SyncPreciosProductos,
      SyncVendedores,
      SyncProductosAlternos,
      SyncListaCuponesEnc,
      SyncListaCuponesDet,
    ]),
  ],
  controllers: [OrigenController],
  providers: [OrigenService],
})
export class OrigenModule {}
