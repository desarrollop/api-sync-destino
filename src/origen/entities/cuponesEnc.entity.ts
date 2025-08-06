import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('SYNC_LISTA_CUPONES_ENC')
export class SyncListaCuponesEnc {
  @PrimaryColumn({ name: 'ID_CUPON', type: 'int' })
  ID_CUPON: number;

  @Column({
    name: 'DESCRIPCION_CUPON',
    type: 'nvarchar',
    length: 100,
    nullable: true,
  })
  DESCRIPCION_CUPON: string;

  @Column({ name: 'FECHA_INICIO', type: 'datetime', nullable: true })
  FECHA_INICIO: Date;

  @Column({ name: 'FECHA_FINAL', type: 'datetime', nullable: true })
  FECHA_FINAL: Date;

  @Column({ name: 'ESTADO', type: 'char', length: 1, nullable: true })
  ESTADO: string;

  @Column({
    name: 'FECHA_SYNC_INSERT_UPDATE',
    type: 'datetime',
    nullable: true,
  })
  FECHA_SYNC_INSERT_UPDATE: Date;

  @Column({ name: 'ELIMINAR', type: 'bit', nullable: true })
  ELIMINAR: boolean;
}
