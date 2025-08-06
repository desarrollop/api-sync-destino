import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('SYNC_PRECIOS_PRODUCTOS')
export class SyncPreciosProductos {
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  @Column({ name: 'PRODUCT0', type: 'nvarchar', length: 50, nullable: false })
  PRODUCT0: string;

  @Column({ name: 'NIVEL_PRECIO', type: 'int', nullable: true })
  NIVEL_PRECIO: number;

  @Column({ name: 'SECUENCIA_PRECIO', type: 'int', nullable: true })
  SECUENCIA_PRECIO: number;

  @Column({ name: 'CANTIDAD_INICIAL', type: 'int', nullable: true })
  CANTIDAD_INICIAL: number;

  @Column({ name: 'CANTIDAD_FINAL', type: 'int', nullable: true })
  CANTIDAD_FINAL: number;

  @Column({ name: 'FECHA_VIGENCIA_I', type: 'datetime', nullable: true })
  FECHA_VIGENCIA_I: Date;

  @Column({ name: 'FECHA_VIGENCIA_F', type: 'datetime', nullable: true })
  FECHA_VIGENCIA_F: Date;

  @Column({ name: 'PRECIO_SUGERIDO', type: 'money', nullable: true })
  PRECIO_SUGERIDO: number;

  @Column({ name: 'PRECIO_PROMOCION', type: 'money', nullable: true })
  PRECIO_PROMOCION: number;

  @Column({
    name: 'FECHA_SYNC_INSERT_UPDATE',
    type: 'datetime',
    nullable: true,
  })
  FECHA_SYNC_INSERT_UPDATE: Date;

  @Column({ name: 'ELIMINAR', type: 'bit', nullable: true })
  ELIMINAR: boolean;
}
