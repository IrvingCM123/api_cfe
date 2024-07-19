import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Usuario {
  @PrimaryGeneratedColumn()
  id_Usuario: number;

  @Column({ nullable: false })
  usuario_Nombre: string;

  @Column({ nullable: false })
  usuario_Apellidos: string;
}
