import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMedidoresTempDto {

    @IsNotEmpty()
    @IsString()
    Direccion_medidor: string;

    @IsNotEmpty()
    @IsString()
    Numero_Serie: string;

    @IsNotEmpty()
    @IsString()
    Categoria: string;

    @IsNotEmpty()
    @IsString()
    status: string;

    @IsString()
    imagen: string;

    @IsNotEmpty()
    @IsString()
    fecha: string;

    @IsString()
    @IsNotEmpty()
    servicio: string;

    @IsString()
    @IsNotEmpty()
    sello: string;

}
