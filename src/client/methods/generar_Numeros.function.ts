
function generar_Numero_Random(): string {
    const numero_Random = Math.floor(100 + Math.random() * 900); // Genera un número aleatorio de 100 a 999
    return numero_Random.toString(); // Convierte el número a cadena
}

export function generar_Formato_Codigo(partes: number): string {

    let codigo = '';

    for (let i = 0; i < partes; i++) {
        const parte = generar_Numero_Random();
        codigo += parte;
        if (i < partes - 1) {
            codigo += '-';
        }
    }
    return codigo;
}