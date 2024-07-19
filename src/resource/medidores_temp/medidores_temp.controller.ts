import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedidoresTempService } from './medidores_temp.service';
import { CreateMedidoresTempDto } from './dto/create-medidores_temp.dto';
import { UpdateMedidoresTempDto } from './dto/update-medidores_temp.dto';

import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/user.decorator';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { parse, stringify } from 'flatted';

interface Medidor {
  Direccion_medidor: string;
  Numero_Serie: string;
  Categoria: string;
  usuario_correo: string;
  status?: string;
  fecha: string;
  imagen: string;
  servicio?: string;
  sello?: string;
}

interface imagen {
  imagen: string;

}

interface Medidor_Actualizar {
  status?: string;
}

interface guardar_Imagen {
  imagen: string;
  numeroserie: string;
}

@Auth(Roles.USUARIO)
@Controller('medidores')
export class MedidoresTempController {
  constructor(private readonly medidoresTempService: MedidoresTempService) {}

  @Post()
  async create(@Body() createMedidoresTempDto: CreateMedidoresTempDto, @ActiveUser() user: User_Interface){

    const medidor: Medidor = {
      Direccion_medidor: createMedidoresTempDto.Direccion_medidor,
      Numero_Serie: createMedidoresTempDto.Numero_Serie,
      Categoria: createMedidoresTempDto.Categoria,
      usuario_correo: user.identificador,
      status: createMedidoresTempDto.status,
      imagen: createMedidoresTempDto.imagen,
      fecha: createMedidoresTempDto.fecha,
      servicio: createMedidoresTempDto.servicio,
      sello: createMedidoresTempDto.sello
    }

    console.log(medidor, "medidor");
  
    return this.medidoresTempService.create(medidor, user);
  }

  @Post('almacenar_fotos')
  async almacenar_fotos(@Body() datos: any, @ActiveUser() user: User_Interface) {
    const imagenString = stringify(datos.imagen);
    return this.medidoresTempService.almacenarfotos(datos.datos.imagen, datos.datos.numeroserie, user);
  }

  @Get()
  findAll( @ActiveUser() user: User_Interface) {
    return this.medidoresTempService.findAll(user);
  }

  @Get('consultar_informacion')
  consultar_Informacion(@ActiveUser() user: User_Interface) {
    return this.medidoresTempService.consultar_Informacion(user);
  }

  @Get('buscar/:id')
  findOne(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.medidoresTempService.findOne(id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMedidoresTempDto: UpdateMedidoresTempDto, @ActiveUser() user: User_Interface) {
    console.log(id, 1);
    console.log(updateMedidoresTempDto, "2");
    const medidor: Medidor_Actualizar = {
      status: 'Revisado'
    }
    return this.medidoresTempService.update(id, medidor, user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    console.log(id);
    return this.medidoresTempService.remove(id, user);
  }
}
