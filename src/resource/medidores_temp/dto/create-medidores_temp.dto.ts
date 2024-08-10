import { IsNotEmpty, IsNumber, IsString, IsEmpty } from 'class-validator';

export class CreateMedidoresTempDto {

    @IsNotEmpty()
    @IsString()
    numero_medidor: string;

    @IsNotEmpty()
    @IsString()
    tipo_medidor: string;

    @IsNotEmpty()
    @IsString()
    numero_sello: string;

    @IsNotEmpty()
    @IsString()
    tipo_sello: string;

    @IsNotEmpty()
    @IsString()
    numero_orden: string;

    @IsNotEmpty()
    @IsString()
    tipo_orden: string;

    @IsNotEmpty()
    @IsString()
    direccion: string;

    @IsNotEmpty()
    imagen: any;

    @IsNotEmpty()
    @IsString()
    fecha: string;

    @IsEmpty()
    cuenta: string | null;

}
