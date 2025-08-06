import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('SYNC_LISTA_CUPONES_DET')
export class SyncListaCuponesDet {
  @PrimaryColumn({ name: 'ID_CUPON', type: 'int' })
  ID_CUPON: number;

  @Column({
    name: 'DESCRIPCION',
    type: 'nvarchar',
    length: 100,
    nullable: true,
  })
  DESCRIPCION: string;

  @Column({
    name: 'CODIGO_CUPON',
    type: 'nvarchar',
    length: 50,
    nullable: false,
  })
  CODIGO_CUPON: string;

  @Column({ name: 'SE_REPITE', type: 'nvarchar', length: 2, nullable: true })
  SE_REPITE: string;

  @Column({ name: 'PORCENTAJE_DESCUENTO', type: 'float', nullable: true })
  PORCENTAJE_DESCUENTO: number;

  @Column({ name: 'UTILIZADO', type: 'nvarchar', length: 1, nullable: true })
  UTILIZADO: string;

  @Column({ name: 'FECHA_UTILIZACIÓN', type: 'datetime', nullable: true })
  FECHA_UTILIZACION: Date;

  @Column({
    name: 'USUARIO_APLICA',
    type: 'nvarchar',
    length: 50,
    nullable: true,
  })
  USUARIO_APLICA: string;

  @Column({ name: 'ES_MONTO', type: 'nvarchar', length: 1, nullable: true })
  ES_MONTO: string;

  @Column({
    name: 'FECHA_SYNC_INSERT_UPDATE',
    type: 'datetime',
    nullable: true,
  })
  FECHA_SYNC_INSERT_UPDATE: Date;

  @Column({ name: 'ELIMINAR', type: 'bit', nullable: true })
  ELIMINAR: boolean;
}
