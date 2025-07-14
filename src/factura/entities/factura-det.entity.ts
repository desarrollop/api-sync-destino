import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'FACTURA_DET' })
export class FacturaDet {
  @PrimaryGeneratedColumn({ name: 'ID_FACTURA_DET' })
  ID_FACTURA_DET: number;

  @Column('char', { name: 'ID_SUCURSAL', length: 2 })
  ID_SUCURSAL: string;

  @Column('char', { name: 'SERIE', length: 4 })
  SERIE: string;

  @Column('int', { name: 'NUMERO_FACTURA' })
  NUMERO_FACTURA: number;

  @Column('varchar', { name: 'PRODUCT0', length: 25 })
  PRODUCT0: string;

  @Column('char', { name: 'CODIGO_UNIDAD_VTA', length: 2 })
  CODIGO_UNIDAD_VTA: string;

  @Column('float', { name: 'CANTIDAD_VENDIDA' })
  CANTIDAD_VENDIDA: number;

  @Column('float', { name: 'CANTIDAD_DEVUELTA', nullable: true })
  CANTIDAD_DEVUELTA?: number;

  @Column('money', { name: 'COSTO_UNITARIO_PROD' })
  COSTO_UNITARIO_PROD: number;

  @Column('money', { name: 'PRECIO_UNITARIO_VTA' })
  PRECIO_UNITARIO_VTA: number;

  @Column('money', { name: 'MONTO_DESCUENTO_DET' })
  MONTO_DESCUENTO_DET: number;

  @Column('money', { name: 'MONTO_IVA' })
  MONTO_IVA: number;

  @Column('money', { name: 'SUBTOTAL_VENTAS' })
  SUBTOTAL_VENTAS: number;

  @Column('money', { name: 'SUBTOTAL_GENERAL', nullable: true })
  SUBTOTAL_GENERAL?: number;

  @Column('money', { name: 'MONTO_DESCUENTO_LINE', nullable: true })
  MONTO_DESCUENTO_LINE?: number;

  @Column('int', { name: 'CORRELATIVO_INGRESO', nullable: true })
  CORRELATIVO_INGRESO?: number;
} 