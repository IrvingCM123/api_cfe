import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('sello')
export class Sello {

    @PrimaryGeneratedColumn()
    id_sello: number;
    
    @Column({ nullable: false })
    numero_sello: string;
    
    @Column({ nullable: false })
    tipo_sello: string;

    @Column({ nullable: true })
    cuenta: string;

}
