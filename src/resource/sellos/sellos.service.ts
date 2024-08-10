import { Injectable } from '@nestjs/common';
import { CreateSelloDto } from './dto/create-sello.dto';
import { UpdateSelloDto } from './dto/update-sello.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sello } from './entities/sello.entity';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { validateAll } from 'src/auth/guard/validateRole.guard';

import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
@Injectable()
export class SellosService {

  constructor(
    @InjectRepository(Sello)
    private selloRepository: Repository<Sello>,
    private transaccionService: TransaccionService
  ) { }

  async create(createSelloDto: CreateSelloDto, user: User_Interface) {

    validateAll(user);
    
    const sello: any = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, Sello, createSelloDto);

    if  (sello == 'Error') {
      return {
        mensaje: 'Error',
        status: 400,
      }
    }

    const agregar = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Sello, user.identificador, 'cuenta', sello.resultado.id_sello);

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
    return this.selloRepository.find();
  }

  findOne(id: number, user: User_Interface) {

    validateAll(user);
    return this.selloRepository.findOneById(id);
  }

  update(id: number, updateSelloDto: UpdateSelloDto) {
    return `This action updates a #${id} sello`;
  }

  async remove(id: number, user: User_Interface) {

    validateAll(user);
    
    return await this.selloRepository.delete(id);
  }
}
