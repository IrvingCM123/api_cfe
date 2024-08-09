import { Injectable } from '@nestjs/common';
import { CreateSelloDto } from './dto/create-sello.dto';
import { UpdateSelloDto } from './dto/update-sello.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sello } from './entities/sello.entity';

@Injectable()
export class SellosService {

  constructor(
    @InjectRepository(Sello)
    private selloRepository: Repository<Sello>,
  ) { }

  create(createSelloDto: CreateSelloDto) {
    return this.selloRepository.save(createSelloDto);
  }

  findAll() {
    return this.selloRepository.find();
  }

  findOne(id: number) {
    return this.selloRepository.findOneById(id);
  }

  update(id: number, updateSelloDto: UpdateSelloDto) {
    return `This action updates a #${id} sello`;
  }

  remove(id: number) {
    return this.selloRepository.delete(id);
  }
}
