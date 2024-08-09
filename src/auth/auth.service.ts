import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { CuentasService } from 'src/resource/cuentas/cuentas.service';
import { ClientService } from 'src/client/client.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Estado } from 'src/common/enums/cuentas.enum';
import { Exito_Cuentas, Errores_Cuentas } from 'src/common/helpers/cuentas.helpers';
import { Exito_USUARIO, Errores_USUARIO } from 'src/common/helpers/usuario.helpers';
import { RegisterDto } from './dto/registro.dto';
import { Usuario } from 'src/resource/usuario/entities/usuario.entity';
import { Cuenta } from 'src/resource/cuentas/entities/cuenta.entity';

import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';
import { CreateUsuarioDto } from 'src/resource/usuario/dto/create-usuario.dto';
import { CreateCuentaDto } from 'src/resource/cuentas/dto/create-cuenta.dto';

@Injectable()
export class AuthService {

  constructor(
    private cuentasService: CuentasService,
    private clientService: ClientService,
    private jwtService: JwtService,
    private transaccionService: TransaccionService,
  ) { }

  async register(registroDTO: RegisterDto) {
    const {
      identificador,
      contraseña,
      usuario_Nombre,
      usuario_Apellidos,
    } = registroDTO;

    const user = await this.cuentasService.findOneByEmail(identificador);

    if (user != false) {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_ALREADY_EXISTS,
      };
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const usuario_Data: CreateUsuarioDto = {
      usuario_Nombre: usuario_Nombre,
      usuario_Apellidos: usuario_Apellidos,
    }

    let nuevo_Usuario: any;

    let crear_Cuenta: any;

    try {
      nuevo_Usuario = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, Usuario, usuario_Data);
      if (nuevo_Usuario.mensaje == 'Error') {
        return {
          status: 400, 
          message: Errores_USUARIO.USUARIO_NOT_CREATED 
        };
      }

      const fecha_registro: Date = new Date();

      const dia: string = fecha_registro.getDate().toString().padStart(2, '0');
      const mes: string = (fecha_registro.getMonth() + 1).toString().padStart(2, '0'); 
      const año: number = fecha_registro.getFullYear();


      const fecha_formateada: string = `${dia}-${mes}-${año}`;

      const cuenta: CreateCuentaDto = {
        cuenta_Identificador: identificador,
        cuenta_Contraseña: hashedPassword,
        id_Usuario: nuevo_Usuario.resultado.id_Usuario,
        cuenta_Fecha_Registro: fecha_formateada,
      }

      crear_Cuenta  = await this.transaccionService.transaction(Tipo_Transaccion.Guardar, Cuenta, cuenta);
      if (crear_Cuenta.mensaje != 'Éxito') {
        await this.transaccionService.transaction(Tipo_Transaccion.Eliminar_Con_Parametros, Usuario, '', 'id_Usuario', nuevo_Usuario.resultado.id_Usuario);
        return {
          status: 400, 
          message: Errores_Cuentas.CUENTA_NOT_CREATED
        };
      }

      return { 
        status: 200,
        usuario_Nombre, 
        identificador, 
        message: Exito_USUARIO.USUARIO_CREATED };
    } catch (error) {
      return {
        status: 400, 
        message: Errores_USUARIO.USUARIO_NOT_CREATED
      };
    }
  }

  async login(loginDto: LoginDto) {

    const { identificador, contraseña } = loginDto;

    const cuenta: any = await this.cuentasService.findOneByEmail(
      identificador
    );

    if (cuenta == null || cuenta == false) {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_FOUND
      }
      
    }

    const contraseña2 = cuenta.cuenta.cuenta_Contraseña;
    const usuario = cuenta.usuario.usuario_Nombre + ' ' + cuenta.usuario.usuario_Apellidos;

    if ( contraseña2 != null && await bcrypt.compare(contraseña, contraseña2) == false) {
      return {
        status: 400,
        message: "Contraseña no válida"
      }
    } else {
      const payload = { identificador: cuenta.cuenta.cuenta_Identificador, role: cuenta.cuenta.cuenta_Rol, usuario: usuario};

      const access_Token = await this.jwtService.signAsync(payload);
  
      return {
        status: 200,
        access_Token,
        message: Exito_USUARIO.Sesion_Activa,
      };
    }


  }
}
