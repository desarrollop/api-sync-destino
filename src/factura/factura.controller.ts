import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpException,
  Logger
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { FacturaEncSync, FacturaSyncData } from './interfaces/factura-sync.interface';

@Controller('factura')
export class FacturaController {
  private readonly logger = new Logger(FacturaController.name);

  constructor(private readonly facturaService: FacturaService) { }

  // TODO: Implementar los endpoints para las facturas , POR EL MOMENTO NO HAY NINGUNO YA QUE SE ESTA USANDO EL ENDPOINT DE SYNC DIRECTO

}
