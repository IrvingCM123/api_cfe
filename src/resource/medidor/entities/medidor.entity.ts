import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('medidor')
export class Medidor {

    @PrimaryGeneratedColumn()
    id_Medidor: number;

    @Column({ nullable: false })
    numero_medidor: string;

    @Column({ nullable: false })
    tipo_medidor: string;

}
