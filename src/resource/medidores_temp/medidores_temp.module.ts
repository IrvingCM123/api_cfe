import { Module } from '@nestjs/common';
import { MedidoresTempService } from './medidores_temp.service';
import { MedidoresTempController } from './medidores_temp.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedidoresTemp } from './entities/medidores_temp.entity';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';

@Module({
  controllers: [MedidoresTempController],
  providers: [MedidoresTempService],
  exports: [MedidoresTempService],
  imports: [ TypeOrmModule.forFeature([MedidoresTemp]), TransaccionModule ]
})
export class MedidoresTempModule {}
