import { IsString, } from "class-validator";

export class CreateMedidorDto {
    @IsString()
    numero_medidor: string;

    @IsString()
    tipo_medidor: string;
}
