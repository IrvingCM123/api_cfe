import { Module } from '@nestjs/common';
import { MedidoresTempService } from './medidores_temp.service';
import { MedidoresTempController } from './medidores_temp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedidoresTemp } from './entities/medidores_temp.entity';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';
import { Medidor } from '../medidor/entities/medidor.entity';
import { MedidorModule } from '../medidor/medidor.module';
import { Sello } from '../sellos/entities/sello.entity';
import { SellosModule } from '../sellos/sellos.module';

@Module({
  controllers: [MedidoresTempController],
  providers: [MedidoresTempService],
  exports: [MedidoresTempService],
  imports: [ TypeOrmModule.forFeature([MedidoresTemp, Medidor, Sello]), TransaccionModule, MedidorModule, SellosModule ]
})
export class MedidoresTempModule {}
