import { Injectable } from '@nestjs/common';
import { CreateMedidorDto } from './dto/create-medidor.dto';
import { UpdateMedidorDto } from './dto/update-medidor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Medidor } from './entities/medidor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MedidorService {

  constructor(
    @InjectRepository(Medidor)
    private medidorRepository: Repository<Medidor>,
  ) {  }

  create(createMedidorDto: CreateMedidorDto) {
    const medidor = this.medidorRepository.save(createMedidorDto);
    console.log(medidor, "servicio");
    return medidor;
  }

  findAll() {
    return this.medidorRepository.find();
  }

  findOne(id: number) {
    return this.medidorRepository.findOneById(id);
  }

  update(id: number, updateMedidorDto: UpdateMedidorDto) {
    return `This action updates a #${id} medidor`;
  }

  remove(id: number) {
    return this.medidorRepository.delete(id);
  }
}
