import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CuponesService } from './cupones.service';
import { CreateCuponesDto } from './dto/create-cupone.dto';


@Controller('cupones')
export class CuponesController {
  constructor(private readonly cuponesService: CuponesService) { }

  // TODO: Implementar los endpoints para los cupones, POR EL MOMENTO NO HAY NINGUNO YA QUE SE ESTA USANDO EL ENDPOINT DE SYNC DIRECTO

}
