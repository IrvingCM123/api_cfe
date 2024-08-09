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
import { sellos, informacion_completa, medidor } from 'src/common/interfaces/medidores.interface';
import { Medidor } from '../medidor/entities/medidor.entity';
import { Sello } from '../sellos/entities/sello.entity';

@Injectable()
export class MedidoresTempService {

  constructor(
    @InjectRepository(MedidoresTemp)
    private medidoresRepository: Repository<MedidoresTemp>,
    @InjectRepository(Medidor)
    private medidorRepository: Repository<Medidor>,
    @InjectRepository(Sello)
    private selloRepository: Repository<Sello>,
    private transaccionService: TransaccionService
  ) { }

  async registrar_medidor(medidores: medidor, user: User_Interface) {
    validateAll(user);
    const registrar: any = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, MedidoresTemp, medidores);
  }

  async create(createMedidoresTempDto: CreateMedidoresTempDto, user: User_Interface) {

    validateAll(user);

    const verificar_Medidor: any = await this.medidorRepository.createQueryBuilder('medidor')
    .where('LOWER(medidor.numero_medidor) = LOWER(:numero_medidor)', {numero_medidor: createMedidoresTempDto.numero_medidor})
    .getOne();

    if (verificar_Medidor === undefined || verificar_Medidor === null || verificar_Medidor == "") {
      return {
        status: 400,
        message: 'El medidor no existe en la base de datos'
      }
    }

    const verificar_Sello: any = await this.selloRepository.createQueryBuilder('sello')
    .where('LOWER(sello.numero_sello) = LOWER(:numero_sello)', {numero_sello: createMedidoresTempDto.numero_sello})
    .getOne();

    if (verificar_Sello === undefined || verificar_Sello === null || verificar_Sello == "") {
      return {
        status: 400,
        message: 'El sello no existe en la base de datos'
      }
    }

    const resultado: any = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, MedidoresTemp, createMedidoresTempDto);

    if (resultado.mensaje === 'Éxito') {
      return {
        status: 201,
        message: 'Se ha actualizado la imagen del medidor'
      }
    } else {
      return {
        status: 400,
        message: 'Ha ocurrido un error, intentelo de nuevo'
      }
    }
  }

  async findAll(user: User_Interface) {
    validateAll(user);

    const nDate = new Date().toLocaleString('en-US', {
      timeZone: 'America/Mexico_City'
    });

    const [datePart, timePart] = nDate.split(', ');
    const [month, day, year] = datePart.split('/');
    const fecha = `${day}/${month}/${year}`;
    const correo = user.identificador;

    let medidor = await this.medidoresRepository
      .createQueryBuilder('medidores_temp')
      .where('LOWER(medidores_temp.usuario_correo) = LOWER(:correo)', { correo })
      .andWhere('(medidores_temp.status) = (:status)', { status: 'Pendiente' })
      .andWhere('(medidores_temp.fecha) = (:fecha)', { fecha })
      .getMany();

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

    if (resultado.mensaje === 'Éxito') {
      return {
        status: 201,
        message: 'Se ha actualizado el estado del medidor'
      }
    } else {
      return {
        status: 400,
        message: 'Ha ocurrido un error, intentelo de nuevo'
      }
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
