import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedidoresTempService } from './medidores_temp.service';
import { CreateMedidoresTempDto } from './dto/create-medidores_temp.dto';
import { UpdateMedidoresTempDto } from './dto/update-medidores_temp.dto';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/user.decorator';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { parse, stringify } from 'flatted';
import { sellos, informacion_completa, medidor } from 'src/common/interfaces/medidores.interface';
@Auth(Roles.USUARIO)
@Controller('medidores')
export class MedidoresTempController {
  constructor(private readonly medidoresTempService: MedidoresTempService) {}

  @Post()
  async create(@Body() createMedidoresTempDto: CreateMedidoresTempDto, @ActiveUser() user: User_Interface){
    return this.medidoresTempService.create(createMedidoresTempDto, user);
  }

  @Get()
  findAll( @ActiveUser() user: User_Interface) {
    return this.medidoresTempService.findAll(user);
  }

  @Get('consultar_informacion')
  consultar_Informacion(@ActiveUser() user: User_Interface) {
    return this.medidoresTempService.consultar_Informacion(user);
  }

  @Get('consultar_informacion_adicional')
  consultar_Informacion_Adicional(@ActiveUser() user: User_Interface) {
    return this.medidoresTempService.consultar_informacion_adicional(user);
  }

  @Get('buscar/:id')
  findOne(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.medidoresTempService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedidoresTempDto: UpdateMedidoresTempDto, @ActiveUser() user: User_Interface) {

    return this.medidoresTempService.update(id, updateMedidoresTempDto, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.medidoresTempService.remove(id, user);
  }
}
