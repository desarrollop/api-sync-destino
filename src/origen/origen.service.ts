import { Injectable, Logger } from '@nestjs/common';
import { CreateOrigenDto } from './dto/create-origen.dto';
import { UpdateOrigenDto } from './dto/update-origen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { SyncMaestroProductos, SyncPreciosProductos } from './entities';
import { SyncVendedores } from './entities/vendedores.entity';
import { SyncProductosAlternos } from './entities/codigosBarra.entity';
import { SyncListaCuponesEnc } from './entities/cuponesEnc.entity';
import { SyncListaCuponesDet } from './entities/cuponesDet.entity';

@Injectable()
export class OrigenService {
  private readonly logger = new Logger(OrigenService.name);

  constructor(
    @InjectRepository(SyncMaestroProductos)
    private readonly syncMaestroProductosRepository: Repository<SyncMaestroProductos>,
    @InjectRepository(SyncPreciosProductos)
    private readonly syncPreciosProductosRepository: Repository<SyncPreciosProductos>,
    @InjectRepository(SyncVendedores)
    private readonly syncVendedoresRepository: Repository<SyncVendedores>,
    @InjectRepository(SyncProductosAlternos)
    private readonly syncCodigosBarraRepository: Repository<SyncProductosAlternos>,
    @InjectRepository(SyncListaCuponesEnc)
    private readonly syncListaCuponesEncRepository: Repository<SyncListaCuponesEnc>,
    @InjectRepository(SyncListaCuponesDet)
    private readonly syncListaCuponesDetRepository: Repository<SyncListaCuponesDet>,
  ) {}

  async sync_productos_gs() {
    // Obtener los productos que se han sincronizado en las últimas 24 horas
    const sync_maestro_productos =
      await this.syncMaestroProductosRepository.find({
        where: {
          FECHA_SYNC_INSERT_UPDATE: MoreThanOrEqual(
            new Date(Date.now() - 1000 * 60 * 60 * 24),
          ),
        },
      });
    return sync_maestro_productos;
  }

  async sync_precios_gs() {
    // Obtener los precios que se han sincronizado en las últimas 24 horas
    const sync_precios_productos =
      await this.syncPreciosProductosRepository.find({
        where: {
          FECHA_SYNC_INSERT_UPDATE: MoreThanOrEqual(
            new Date(Date.now() - 1000 * 60 * 60 * 24),
          ),
        },
      });
    return sync_precios_productos;
  }

  async sync_vendedores_gs() {
    // Obtener los vendedores que se han sincronizado en las últimas 24 horas
    const sync_vendedores = await this.syncVendedoresRepository.find({
      where: {
        FECHA_SYNC_INSERT_UPDATE: MoreThanOrEqual(
          new Date(Date.now() - 1000 * 60 * 60 * 24),
        ),
      },
    });
    return sync_vendedores;
  }

  async sync_codigos_barra_gs() {
    // Obtener los CODIGOS DE BARRAS que se han sincronizado en las últimas 24 horas
    const sync_codigos_barra = await this.syncCodigosBarraRepository.find({
      where: {
        FECHA_SYNC_INSERT_UPDATE: MoreThanOrEqual(
          new Date(Date.now() - 1000 * 60 * 60 * 24),
        ),
      },
    });
    return sync_codigos_barra;
  }

  async sync_cupones_enc_gs() {
    // Obtener los cupones enc que se han sincronizado en las últimas 24 horas
    const sync_cupones_enc = await this.syncListaCuponesEncRepository.find({
      where: {
        FECHA_SYNC_INSERT_UPDATE: MoreThanOrEqual(
          new Date(Date.now() - 1000 * 60 * 60 * 24),
        ),
      },
    });
    return sync_cupones_enc;
  }

  async sync_cupones_det_gs() {
    // Obtener los CUPONES DET que se han sincronizado en las últimas 24 horas
    const sync_cupones_det = await this.syncListaCuponesDetRepository.find({
      where: {
        FECHA_SYNC_INSERT_UPDATE: MoreThanOrEqual(
          new Date(Date.now() - 1000 * 60 * 60 * 24),
        ),
      },
    });
    return sync_cupones_det;
  }
}
