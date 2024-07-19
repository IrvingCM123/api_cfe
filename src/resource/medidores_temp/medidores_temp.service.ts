import { Injectable } from '@nestjs/common';
import { CreateMedidoresTempDto } from './dto/create-medidores_temp.dto';
import { UpdateMedidoresTempDto } from './dto/update-medidores_temp.dto';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { validateAll } from 'src/auth/guard/validateRole.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { MedidoresTemp } from './entities/medidores_temp.entity';
import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
import * as moment from 'moment-timezone';

interface Medidor {
  Direccion_medidor: string;
  Numero_Serie: string;
  Categoria: string;
}

@Injectable()
export class MedidoresTempService {

  constructor(
    @InjectRepository(MedidoresTemp)
    private medidoresRepository: Repository<MedidoresTemp>,
    private transaccionService: TransaccionService
  ) { }

  async create(createMedidoresTempDto: any, user: User_Interface) {

    validateAll(user);

    return await this.medidoresRepository.save(createMedidoresTempDto);
  }

  async almacenarfotos( imagen: any,numeroserie: string, user: User_Interface) {

    validateAll(user);

    const correo = user.identificador;
    let medidor = await this.medidoresRepository
    .createQueryBuilder('medidores_temp')
    .where('LOWER(medidores_temp.usuario_correo) = LOWER(:correo)', { correo })
    .andWhere('(medidores_temp.Numero_Serie) = (:numeroserie)', { numeroserie })
    .getOne();

    const identificador = (medidor.id).toString();

    const resultado: any = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, MedidoresTemp, imagen, 'imagen', identificador);
    medidor.imagen = imagen;
    //return await this.medidoresRepository.save(medidor);

  }

  async findAll(user: User_Interface) {
    validateAll(user);
    
    const nDate = new Date().toLocaleString('en-US', {
      timeZone: 'America/Mexico_City'
    });

  // Separa la fecha y la hora
  const [datePart, timePart] = nDate.split(', ');

  // Separa el mes, día y año de la parte de la fecha
  const [month, day, year] = datePart.split('/');

  const fecha = `${day}/${month}/${year}`;

  console.log(month, "1", day, "2", year, "3");
  console.log(fecha, 3);

    const correo = user.identificador;
    let medidor = await this.medidoresRepository
    .createQueryBuilder('medidores_temp')
    .where('LOWER(medidores_temp.usuario_correo) = LOWER(:correo)', { correo })
    .andWhere('(medidores_temp.status) = (:status)', { status: 'Pendiente' })
    .andWhere('(medidores_temp.fecha) = (:fecha)', { fecha })
    .getMany();

    console.log(medidor, 1);
    console.log(correo, 2);
    console.log(fecha, 3);
    console.log('aqui', 4);

    return medidor;
  }

  async consultar_Informacion(user: User_Interface) {
    validateAll(user);
    
    const correo = user.identificador;
    let medidor = await this.medidoresRepository
    .createQueryBuilder('medidores_temp')
    .where('LOWER(medidores_temp.usuario_correo) = LOWER(:correo)', { correo })
    .andWhere('(medidores_temp.status) = (:status)', { status: 'Revisado' })
    .getMany();

    console.log(medidor, 1, "2");
    console.log(correo, 2, "2");

    return medidor;
  }

  async findOne(id: string, user: User_Interface) {
    validateAll(user);
    const correo = user.identificador;
    let medidor = await this.medidoresRepository
    .createQueryBuilder('medidores_temp')
    .where('LOWER(medidores_temp.usuario_correo) = LOWER(:correo)', { correo })
    .andWhere('(medidores_temp.Numero_Serie) = (:id)', { id })
    .getOne();    
    return medidor;
  }

  async update(id: string, updateMedidoresTempDto: any, user: User_Interface) {
    const estado = updateMedidoresTempDto.status;
    validateAll(user);
    const correo = user.identificador;

    let medidor = await this.medidoresRepository
    .createQueryBuilder('medidores_temp')
    .where('(medidores_temp.Numero_Serie) = (:id)', { id })
    .andWhere('LOWER(medidores_temp.usuario_correo) = LOWER(:correo)', { correo })
    .getOne();

    let identificador = (medidor.id).toString();

    const resultado: any = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, MedidoresTemp, estado, 'status', identificador);
    console.log(resultado, 6);
    return {
      message: 'Se ha actualizado el estado del medidor'
    }
  }

  async remove(Numero_Serie: string, user: User_Interface) {
    validateAll(user);

    const correo = user.identificador;

    let medidor = await this.medidoresRepository
    .createQueryBuilder('medidores_temp')
    .where('LOWER(medidores_temp.Numero_Serie) = LOWER(:Numero_Serie)', { Numero_Serie })
    .andWhere('LOWER(medidores_temp.usuario_correo) = LOWER(:correo)', { correo })
    .getOne();
  
    
    return this.medidoresRepository.delete(medidor.id);
  }
}
