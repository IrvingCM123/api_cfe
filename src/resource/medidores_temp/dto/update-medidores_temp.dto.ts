import { PartialType } from '@nestjs/mapped-types';
import { CreateMedidoresTempDto } from './create-medidores_temp.dto';
import  { IsNotEmpty, IsString } from 'class-validator';

export class UpdateMedidoresTempDto extends PartialType(CreateMedidoresTempDto) {
    
        @IsNotEmpty()
        @IsString()
        status: string;
}
