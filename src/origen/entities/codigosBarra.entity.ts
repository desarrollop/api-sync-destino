import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('SYNC_PRODUCTOS_ALTERNOS')
export class SyncProductosAlternos {
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  @Column({ name: 'PRODUCT0', type: 'nvarchar', length: 25, nullable: true })
  PRODUCT0: string;

  @Column({
    name: 'CODIGO_BARRA',
    type: 'nvarchar',
    length: 50,
    nullable: true,
  })
  CODIGO_BARRA: string;

  @Column({
    name: 'FECHA_SYNC_INSERT_UPDATE',
    type: 'datetime',
    nullable: true,
  })
  FECHA_SYNC_INSERT_UPDATE: Date;

  @Column({ name: 'ELIMINAR', type: 'bit', nullable: true })
  ELIMINAR: boolean;
}
