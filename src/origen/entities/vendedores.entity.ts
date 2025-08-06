import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('SYNC_VENDEDORES')
export class SyncVendedores {
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  @Column({ name: 'CODIGO_VENDEDOR', type: 'int', nullable: true })
  CODIGO_VENDEDOR: number;

  @Column({
    name: 'NOMBRE_VENDEDOR',
    type: 'nvarchar',
    length: 100,
    nullable: true,
  })
  NOMBRE_VENDEDOR: string;

  @Column({ name: 'ESTADO_VENDEDOR', type: 'char', length: 1, nullable: true })
  ESTADO_VENDEDOR: string;

  @Column({ name: 'CLAVE', type: 'nvarchar', length: 50, nullable: true })
  CLAVE: string;

  @Column({ name: 'TIPO', type: 'nvarchar', length: 5, nullable: true })
  TIPO: string;

  @Column({
    name: 'FECHA_SYNC_INSERT_UPDATE',
    type: 'datetime',
    nullable: true,
  })
  FECHA_SYNC_INSERT_UPDATE: Date;

  @Column({ name: 'ELIMINAR', type: 'bit', nullable: true })
  ELIMINAR: boolean;
}
