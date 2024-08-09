import { Module } from '@nestjs/common';
import { MedidorService } from './medidor.service';
import { MedidorController } from './medidor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medidor } from './entities/medidor.entity';

@Module({
  controllers: [MedidorController],
  providers: [MedidorService],
  exports: [MedidorService],
  imports: [ TypeOrmModule.forFeature([Medidor])]
})
export class MedidorModule {}
