import { PartialType } from '@nestjs/mapped-types';
import { CreateOrigenDto } from './create-origen.dto';

export class UpdateOrigenDto extends PartialType(CreateOrigenDto) {}
