import { IsString } from "class-validator";

export class CreateSelloDto {

    @IsString()
    numero_sello: string;

    @IsString()
    tipo_sello: string;

}
