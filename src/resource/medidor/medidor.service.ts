import { Injectable } from '@nestjs/common';
import { CreateMedidorDto } from './dto/create-medidor.dto';
import { UpdateMedidorDto } from './dto/update-medidor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Medidor } from './entities/medidor.entity';
import { Repository } from 'typeorm';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { validateAll } from 'src/auth/guard/validateRole.guard';

import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';

@Injectable()
export class MedidorService {

  constructor(
    @InjectRepository(Medidor)
    private medidorRepository: Repository<Medidor>,
    private transaccionService: TransaccionService
  ) {  }

  async create(createMedidorDto: CreateMedidorDto, user: User_Interface) {

    validateAll(user);

    const medidor: any = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, Medidor, createMedidorDto);

    if (medidor == 'Error') {
      return {
        mensaje: 'Error',
        status: 400,
      }
    }

    const agregar: any = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Medidor, user.identificador, 'cuenta', medidor.resultado.id_Medidor);
    
    if (agregar == 'Error') {
      return {
        mensaje: 'Error',
        status: 400,
      }
    }

    return {
      mensaje: 'Éxito',
      status: 201,
    }
  }

  findAll(user: User_Interface) {

    validateAll(user);

    return this.medidorRepository.find();
  }

  findOne(id: number, user: User_Interface) {

    validateAll(user);
    return this.medidorRepository.findOneById(id);
  }

  update(id: number, updateMedidorDto: UpdateMedidorDto) {
    return `This action updates a #${id} medidor`;
  }

  async remove(id: number, user: User_Interface) {

    validateAll(user);
    return await this.medidorRepository.delete(id);
  }
}
