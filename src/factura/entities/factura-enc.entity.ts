import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'FACTURA_ENC' })
export class FacturaEnc {
  @PrimaryGeneratedColumn({ name: 'ID_FACTURA_ENC' })
  ID_FACTURA_ENC: number;

  @Column('char', { name: 'ID_SUCURSAL', length: 2 })
  ID_SUCURSAL: string;

  @Column('char', { name: 'SERIE', length: 4 })
  SERIE: string;

  @Column('int', { name: 'NUMERO_FACTURA' })
  NUMERO_FACTURA: number;

  @Column('datetime', { name: 'FECHA_DE_FACTURA' })
  FECHA_DE_FACTURA: Date;

  @Column('nvarchar', { name: 'USUARIO_QUE_FACTURA', length: 10 })
  USUARIO_QUE_FACTURA: string;

  @Column('money', { name: 'MONTO_DESCUENTO_FACT' })
  MONTO_DESCUENTO_FACT: number;

  @Column('money', { name: 'IVA_FACTURA' })
  IVA_FACTURA: number;

  @Column('money', { name: 'TOTAL_GENERAL' })
  TOTAL_GENERAL: number;

  @Column('nvarchar', { name: 'NOMBRE_CLI_A_FACTUAR', length: 200 })
  NOMBRE_CLI_A_FACTUAR: string;

  @Column('nvarchar', { name: 'NIT_CLIEN_A_FACTURAR', length: 15 })
  NIT_CLIEN_A_FACTURAR: string;

  @Column('nvarchar', { name: 'DIRECCION_CLI_FACTUR', length: 200 })
  DIRECCION_CLI_FACTUR: string;

  @Column('char', { name: 'ESTADO_DE_FACTURA', length: 1 })
  ESTADO_DE_FACTURA: string;

  @Column('int', { name: 'CODIGO_DE_CLIENTE' })
  CODIGO_DE_CLIENTE: number;

  @Column('int', { name: 'CODIGO_VENDEDOR' })
  CODIGO_VENDEDOR: number;

  @Column('int', { name: 'NUMERO_DE_PEDIDO' })
  NUMERO_DE_PEDIDO: number;

  @Column('float', { name: 'PORC_DESCUENTO_GLOB' })
  PORC_DESCUENTO_GLOB: number;

  @Column('int', { name: 'CORRELATIVO', nullable: true })
  CORRELATIVO?: number;

  @Column('varchar', { name: 'TIPO_CONTRIBUYENTE', length: 1, nullable: true })
  TIPO_CONTRIBUYENTE?: string;

  @Column('bigint', { name: 'CORR_CONTINGENCIA', nullable: true })
  CORR_CONTINGENCIA?: number;

} 