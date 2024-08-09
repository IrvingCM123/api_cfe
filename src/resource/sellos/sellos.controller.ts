import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellosService } from './sellos.service';
import { CreateSelloDto } from './dto/create-sello.dto';
import { UpdateSelloDto } from './dto/update-sello.dto';

@Controller('sellos')
export class SellosController {
  constructor(private readonly sellosService: SellosService) {}

  @Post()
  create(@Body() createSelloDto: CreateSelloDto) {
    return this.sellosService.create(createSelloDto);
  }

  @Get()
  findAll() {
    return this.sellosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSelloDto: UpdateSelloDto) {
    return this.sellosService.update(+id, updateSelloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellosService.remove(+id);
  }
}
