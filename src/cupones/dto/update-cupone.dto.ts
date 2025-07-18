import { PartialType } from '@nestjs/mapped-types';
import { CreateCuponesDto } from './create-cupone.dto';

export class UpdateCuponesDto extends PartialType(CreateCuponesDto) { }
