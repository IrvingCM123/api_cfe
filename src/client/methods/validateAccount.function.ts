import { template_Email_Codigos } from "../template/template_Info_Usuario.template";
import { generar_Formato_Codigo } from "./generar_Numeros.function";

export function activar_Cuenta(usuario_Email: string) {
    const numero_Activacion = generar_Formato_Codigo(3);
    let template_email = template_Email_Codigos(
        usuario_Email, 
        numero_Activacion, 
        "Nuestra aerolinea te da la bienvenida!", 
        " Gracias por elegirnos, por favor revise su correo electrónico para confirmar su cuenta. Para validar su cuenta registre los siguientes números: " 
    ); 

    return { template_email, numero_Activacion} ;
}

