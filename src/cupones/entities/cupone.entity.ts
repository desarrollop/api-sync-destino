import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('CUPONES')
export class Cupones {
  @PrimaryGeneratedColumn({ name: 'ID' })
  id: number;

  @Column({ name: 'NUMERO_CUPON', type: 'nvarchar', length: 50, nullable: false })
  NUMERO_CUPON: string;

  @Column({ name: 'NUMERO_PEDIDO', type: 'bigint', nullable: true })
  NUMERO_PEDIDO: number;

  @Column({ name: 'ID_SUCURSAL', type: 'int', nullable: true })
  ID_SUCURSAL: number;

  @Column({ name: 'VENDEDOR_APLICA', type: 'int', nullable: true })
  VENDEDOR_APLICA: number;

  @Column({ name: 'FECHA_APLICACION', type: 'datetime', nullable: true })
  FECHA_APLICACION: Date;

  @Column({ name: 'SERIE', type: 'nvarchar', length: 50, nullable: true })
  SERIE: string;

  @Column({ name: 'NUMERO_FACTURA', type: 'bigint', nullable: true })
  NUMERO_FACTURA: number;
}
