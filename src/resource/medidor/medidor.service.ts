import { Injectable } from '@nestjs/common';
import { CreateMedidorDto } from './dto/create-medidor.dto';
import { UpdateMedidorDto } from './dto/update-medidor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Medidor } from './entities/medidor.entity';
import { Repository } from 'typeorm';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { validateAll } from 'src/auth/guard/validateRole.guard';

@Injectable()
export class MedidorService {

  constructor(
    @InjectRepository(Medidor)
    private medidorRepository: Repository<Medidor>,
  ) {  }

  async create(createMedidorDto: CreateMedidorDto, user: User_Interface) {

    validateAll(user);

    const medidor = await this.medidorRepository.save(createMedidorDto);
    console.log(medidor, "servicio");
    return medidor;
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
