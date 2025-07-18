import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateCuponesDto {
  @IsOptional()
  @IsString()
  NUMERO_CUPON?: string;

  @IsOptional()
  @IsNumber()
  NUMERO_PEDIDO?: number;

  @IsOptional()
  @IsNumber()
  SUCURSAL?: number;

  @IsOptional()
  @IsNumber()
  VENDEDOR_APLICA?: number;

  @IsOptional()
  @IsString()
  ESTADO?: string;

  @IsOptional()
  @IsDateString()
  FECHA?: Date;

  @IsOptional()
  @IsString()
  SERIE?: string;

  @IsOptional()
  @IsNumber()
  NUMERO_FACTURA?: number;
}
