export interface medidor {
    numero_medidor: string;
    tipo_medidor: string;
}

export interface informacion_completa {
    numero_medidor: string;
    numero_sello: string;
    numero_orden: string;
    tipo_orden: string;
    imagen: string;
}

export interface sellos {
    numero_sello: string | number;
    tipo_sello : string;
}