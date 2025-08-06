import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { OrigenService } from './origen.service';
import { CreateOrigenDto } from './dto/create-origen.dto';
import { UpdateOrigenDto } from './dto/update-origen.dto';

@Controller('origen')
export class OrigenController {
  constructor(private readonly origenService: OrigenService) {}

  @Post('sync_precios')
  sync_precios() {
    return this.origenService.sync_precios_gs();
  }

  @Post('sync_productos')
  sync_productos() {
    return this.origenService.sync_productos_gs();
  }

  @Post('sync_vendedores')
  sync_vendedores() {
    return this.origenService.sync_vendedores_gs();
  }

  @Post('sync_codigos_barra')
  sync_codigos_barra() {
    return this.origenService.sync_codigos_barra_gs();
  }

  @Post('sync_cupones_enc')
  sync_cupones_enc() {
    return this.origenService.sync_cupones_enc_gs();
  }

  @Post('sync_cupones_det')
  sync_cupones_det() {
    return this.origenService.sync_cupones_det_gs();
  }
}
