import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'ERROR_SYNC' })
export class ErrorSync {
  @PrimaryGeneratedColumn({ name: 'ID' })
  ID: number;

  @Column('nvarchar', { name: 'SERIE', length: 10, nullable: true })
  SERIE: string;

  @Column('bigint', { name: 'NUMERO_FACTURA', nullable: true })
  NUMERO_FACTURA: number;

  @Column('nvarchar', { name: 'NOMBRE_ARCHIVO', length: 50, nullable: true })
  NOMBRE_ARCHIVO: string;

  @Column('text', { name: 'ERROR', nullable: true })
  ERROR: string;

  @Column('nvarchar', { name: 'ESTADO', length: 50, nullable: true })
  ESTADO: string;

  @CreateDateColumn({ name: 'FECHA_CREACION' })
  FECHA_CREACION: Date;
} 