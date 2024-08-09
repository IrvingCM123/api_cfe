import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellosService } from './sellos.service';
import { CreateSelloDto } from './dto/create-sello.dto';
import { UpdateSelloDto } from './dto/update-sello.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';
import { ActiveUser } from 'src/common/decorators/user.decorator';
import { User_Interface } from 'src/common/interfaces/user.interface';

@Auth(Roles.USUARIO)
@Controller('sellos')
export class SellosController {
  constructor(private readonly sellosService: SellosService) {}

  @Post()
  create(@Body() createSelloDto: CreateSelloDto, @ActiveUser() user: User_Interface) {
    return this.sellosService.create(createSelloDto, user);
  }

  @Get()
  findAll(@ActiveUser() user: User_Interface) {
    return this.sellosService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.sellosService.findOne(+id, user);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSelloDto: UpdateSelloDto) {
    return this.sellosService.update(+id, updateSelloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @ActiveUser() user: User_Interface) {
    return this.sellosService.remove(+id, user);
  }
}
