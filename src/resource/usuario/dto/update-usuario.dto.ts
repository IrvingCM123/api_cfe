import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsString, IsPhoneNumber, MaxLength, Matches, IsNumber, Max, Min } from 'class-validator';
import { Error_Registro } from "src/common/helpers/registro.helpers";

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {

    @IsString()
    @MaxLength(50)
    usuario_Nombres: string;

    @IsString()
    @MaxLength(50)
    usuario_Apellidos: string;

}
