import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedidorService } from './medidor.service';
import { CreateMedidorDto } from './dto/create-medidor.dto';
import { UpdateMedidorDto } from './dto/update-medidor.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/user.decorator';
import { User_Interface } from 'src/common/interfaces/user.interface';

@Auth(Roles.USUARIO)
@Controller('medidor')
export class MedidorController {
  constructor(private readonly medidorService: MedidorService) {}

  @Post()
  create(@Body() createMedidorDto: CreateMedidorDto, @ActiveUser() user: User_Interface) {
    return this.medidorService.create(createMedidorDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: User_Interface) {
    return this.medidorService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.medidorService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedidorDto: UpdateMedidorDto) {
    return this.medidorService.update(+id, updateMedidorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.medidorService.remove(+id, user);
  }
}
