import { Module } from '@nestjs/common';
import { SellosService } from './sellos.service';
import { SellosController } from './sellos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sello } from './entities/sello.entity';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';

@Module({
  controllers: [SellosController],
  providers: [SellosService],
  exports: [SellosService],
  imports: [ TypeOrmModule.forFeature([Sello]), TransaccionModule]
})
export class SellosModule {}
