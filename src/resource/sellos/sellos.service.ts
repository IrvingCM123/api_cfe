import { Injectable } from '@nestjs/common';
import { CreateSelloDto } from './dto/create-sello.dto';
import { UpdateSelloDto } from './dto/update-sello.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sello } from './entities/sello.entity';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { validateAll } from 'src/auth/guard/validateRole.guard';

@Injectable()
export class SellosService {

  constructor(
    @InjectRepository(Sello)
    private selloRepository: Repository<Sello>,
  ) { }

  async create(createSelloDto: CreateSelloDto, user: User_Interface) {

    validateAll(user);
    return await this.selloRepository.save(createSelloDto);
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
