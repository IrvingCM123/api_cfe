import { Error_Registro } from "src/common/helpers/registro.helpers";
import { IsString, IsPhoneNumber, MaxLength, Matches, IsNumber, Max, Min, MinLength } from 'class-validator';

export class CreateUsuarioDto {

    @IsString()
    @MaxLength(50)
    usuario_Nombre: string;

    @IsString()
    @MaxLength(50)
    usuario_Apellidos: string;
    
}
