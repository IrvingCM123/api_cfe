import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCuentaDto } from './dto/create-cuenta.dto';
import { UpdateCuentaDto } from './dto/update-cuenta.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository, getConnection } from 'typeorm';
import { Cuenta } from './entities/cuenta.entity';

import { Errores_Cuentas, Exito_Cuentas } from 'src/common/helpers/cuentas.helpers';

import { Estado } from 'src/common/enums/cuentas.enum';
import * as bcrypt from 'bcrypt';
import { User_Interface } from 'src/common/interfaces/user.interface';
import { validateAdmin } from 'src/auth/guard/validateRole.guard';

import { TransaccionService } from 'src/common/transaction/transaccion.service';
import { Tipo_Transaccion } from 'src/common/enums/tipo_Transaccion.enum';

@Injectable()
export class CuentasService {

  constructor(
    @InjectRepository(Cuenta)
    private cuentaRepository: Repository<Cuenta>,
    private transaccionService: TransaccionService
  ) { }

  async create(createCuentaDto: CreateCuentaDto) {
    let cuenta_nueva = this.cuentaRepository.create(createCuentaDto);
    return this.cuentaRepository.save(cuenta_nueva);
  }

  findAll() {
    return this.cuentaRepository.find();
  }

  async findOneByEmail(identificador: string) {

    let buscar_cuenta = await this.cuentaRepository
      .createQueryBuilder('cuenta')
      .leftJoinAndSelect('cuenta.id_Usuario', "usuario")
      .where('LOWER(cuenta.cuenta_Identificador) = LOWER(:identificador)', { identificador })
      .getOne();

    if (buscar_cuenta) {
      let cuenta = {
        cuenta_ID: buscar_cuenta.id_Cuenta,
        cuenta_Identificador: buscar_cuenta.cuenta_Identificador,
        cuenta_Contraseña: buscar_cuenta.cuenta_Contraseña,
        cuenta_Estado_Cuenta: buscar_cuenta.cuenta_Estado_Cuenta,
        cuenta_Rol: buscar_cuenta.cuenta_Rol,
      };

      let info_usuario = buscar_cuenta.id_Usuario;

      let usuario = {
        usuario_ID: info_usuario.id_Usuario,
        usuario_Nombre: info_usuario.usuario_Nombre,
        usuario_Apellidos: info_usuario.usuario_Apellidos,
      };

      return { cuenta, usuario };
    } else {
      return Errores_Cuentas.CUENTA_NOT_FOUND, false;
    }
  }

  findOne(id: number) {
    try {
      return this.cuentaRepository.findOneById(id);
    } catch (error) {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_FOUND
      }
    }
  }

  update(id: number, updateCuentaDto: UpdateCuentaDto) {
    return this.cuentaRepository.update(id, updateCuentaDto);
  }

  async actualizarEstadoCuenta(identificador: string, estado_cuenta: any) {

    const cuentaUsuario: any = await this.cuentaRepository.findOne({
      where: { cuenta_Identificador: identificador },
    });

    if (!cuentaUsuario) {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_FOUND
      }
    }

    const cuenta_ID = cuentaUsuario.id_Cuenta;

    let resultato = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Cuenta, estado_cuenta, 'cuenta_Estado_Cuenta', cuenta_ID);

    if (resultato == 'Éxito') {
      return {
        status: 201,
        message: Exito_Cuentas.CUENTA_ACTUALIZADA
      }
    } else {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_UPDATED
      }
    }
  }

  async activarCuenta(identificador: string, numero_activacion: string) {

    const cuentaUsuario: any = await this.cuentaRepository.findOne({
      where: { cuenta_Identificador: identificador },
    });

    if (!cuentaUsuario) {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_FOUND
      };
    }

    if (!(await bcrypt.compare(numero_activacion, cuentaUsuario.cuenta_Numero_Activacion))) {
      return {
        status: 400,
        message: Errores_Cuentas.NUMERO_ACTIVACION_NO_VALIDO
      }
    }

    const cuenta_ID = cuentaUsuario.id_Cuenta;

    let resultado = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Cuenta, Estado.ACTIVO, 'cuenta_Estado_Cuenta', cuenta_ID);

    if (resultado == 'Éxito') {
      return {
        status: 201,
        message: Exito_Cuentas.CUENTA_ACTUALIZADA
      }
    } else {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_UPDATED
      }
    }
  }

  async actualizarContraseña(identificador: string, contraseña: string, codigo: number) {

    const cuentaUsuario = await this.cuentaRepository
      .createQueryBuilder('cuenta')
      .where('LOWER(cuenta.cuenta_Identificador) = LOWER(:identificador)', { identificador })
      .getOne();

    if (!cuentaUsuario || cuentaUsuario == undefined || cuentaUsuario == null) {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_FOUND
      }
    }

    const cuenta_ID: any = cuentaUsuario.id_Cuenta;


    const comparacion = await bcrypt.compare(codigo, cuentaUsuario.cuenta_Codigo_Recuperacion)

    if (!bcrypt.compare(`${codigo}`, cuentaUsuario.cuenta_Codigo_Recuperacion)) {
      return {
        status: 400,
        message: Errores_Cuentas.NUMERO_ACTIVACION_NO_VALIDO
      }
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    let resultado = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Cuenta, hashedPassword, 'cuenta_Contraseña', cuenta_ID);

    if (resultado == 'Éxito') {
      return {
        status: 201,
        message: Exito_Cuentas.CONTRASEÑA_ACTUALIZADA
      }
    } else {
      return {
        status: 400,
        message: Errores_Cuentas.CONTRASEÑA_NO_ACTUALIZADA

      }
    }
  }

  async registrar_codigo(codigo: string, identificador: string) {

    const cuentaUsuario = await this.cuentaRepository
      .createQueryBuilder('cuenta')
      .where('LOWER(cuenta.cuenta_Identificador) = LOWER(:identificador)', { identificador })
      .getOne();

    if (!cuentaUsuario || cuentaUsuario == undefined || cuentaUsuario == null) {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_FOUND
      }
    } else {
      const cuenta_ID: any = cuentaUsuario.id_Cuenta;
      const codigo_encriptado = await bcrypt.hash(codigo, 10);

      let resultado = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Cuenta, codigo_encriptado, 'cuenta_Codigo_Recuperacion', cuenta_ID);

      if (resultado == 'Éxito') {
        return {
          status: 201,
          message: Exito_Cuentas.CODIGO_REGISTRADO
        }
      } else {
        return {
          status: 400,
          message: Errores_Cuentas.CODIGO_NO_REGISTRADO
        }
      }
    }

  }

  async validar_codigo(identificador: string, codigo: string) {

    const cuentaUsuario = await this.cuentaRepository
      .createQueryBuilder('cuenta')
      .where('LOWER(cuenta.cuenta_Identificador) = LOWER(:identificador)', { identificador })
      .getOne();

    if (!cuentaUsuario || cuentaUsuario == null || cuentaUsuario == undefined) {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_FOUND
      }
    }

    if (!(await bcrypt.compare(codigo, cuentaUsuario.cuenta_Codigo_Recuperacion))) {
      return {
        status: 400,
        message: Errores_Cuentas.NUMERO_ACTIVACION_NO_VALIDO
      }
    }

    return {
      status: 201,
    }
  }

  async remove(identificador: string, user: User_Interface) {
    validateAdmin(user);

    const cuentaUsuario: any = await this.cuentaRepository.findOne({
      where: { cuenta_Identificador: identificador },
    });

    if (!cuentaUsuario) {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_FOUND
      }
    }

    const cuenta_ID = cuentaUsuario.id_Cuenta;

    let resultado = await this.transaccionService.transaction(Tipo_Transaccion.Actualizar_Con_Parametros, Cuenta, Estado.ELIMINADO, 'cuenta_Estado_Cuenta', cuenta_ID);

    if (resultado == 'Éxito') {
      return {
        status: 201,
        message: Exito_Cuentas.CUENTA_ELIMINADA
      }
    } else {
      return {
        status: 400,
        message: Errores_Cuentas.CUENTA_NOT_CREATED
      }
    }
  }
}
