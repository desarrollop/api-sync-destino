import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'SYNC_MAESTRO_PRODUCTOS' })
export class SyncMaestroProductos {
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  @Column({ name: 'PRODUCT0', type: 'nvarchar', length: 50, nullable: true })
  PRODUCT0: string;

  @Column({
    type: 'nvarchar',
    length: 150,
    nullable: true,
  })
  DESCRIPCION_PROD: string;

  @Column({ name: 'COSTO_PROMEDIO', type: 'money', nullable: true })
  COSTO_PROMEDIO: number;

  @Column({ name: 'ESTADO_PRODUCTO', type: 'char', length: 1, nullable: true })
  ESTADO_PRODUCTO: string;

  @Column({ name: 'CODIGO_MARCA', type: 'int', nullable: true })
  CODIGO_MARCA: number;

  @Column({
    name: 'FECHA_SYNC_INSERT_UPDATE',
    type: 'datetime',
    nullable: true,
  })
  FECHA_SYNC_INSERT_UPDATE: Date;

  @Column({ name: 'ELIMINAR', type: 'bit', nullable: true })
  ELIMINAR: boolean;
}
