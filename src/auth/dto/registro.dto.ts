import { Transform } from 'class-transformer';
import {
    IsNotEmpty,
    IsString,
    Matches,
    MaxLength,
    MinLength,
    IsNumber,
    Max,
    Min,
    IsOptional
} from 'class-validator';

import { Error_Registro } from 'src/common/helpers/registro.helpers';

export class RegisterDto {

    @IsNotEmpty()
    @Matches(/^(?:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/)
    identificador: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Transform(({ value }) => value.trim())
    contraseña : string;

    @IsString()
    @MaxLength(50)
    usuario_Nombre: string;

    @IsString()
    @MaxLength(50)
    usuario_Apellidos: string;

}
