import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Medidores } from 'src/common/enums/medidores.enum';

@Entity( 'medidores_temp' )
export class MedidoresTemp {

    @PrimaryGeneratedColumn()
    id: number;

    @Column( {nullable: false} )
    Direccion_medidor: string;

    @Column()
    Numero_Serie: string;

    @Column({ nullable: false, type: 'enum', enum: Medidores })
    Categoria: string;

    @Column()
    usuario_correo: string;

    @Column({default: 'Pendiente'})
    status: string;

    @Column('text')
    imagen: Buffer;

    @Column()
    fecha: string;

    @Column()
    servicio: string;

    @Column()
    sello: string;
    
}
