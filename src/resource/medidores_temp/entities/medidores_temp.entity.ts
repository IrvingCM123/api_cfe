import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Medidores } from 'src/common/enums/medidores.enum';

@Entity('medidores_temp')
export class MedidoresTemp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  numero_medidor: string;

  @Column({ nullable: false })
  tipo_medidor: string;

  @Column({ nullable: false })
  numero_sello: string;

  @Column({ nullable: false })
  tipo_sello: string;

  @Column({ nullable: false })
  numero_orden: string;

  @Column({ nullable: false })
  tipo_orden: string;

  @Column({ nullable: false })
  direccion: string;

  @Column('text')
  imagen: Buffer;

  @Column({ nullable: false })
  fecha: string;

  @Column()
  cuenta: string;
  
}
