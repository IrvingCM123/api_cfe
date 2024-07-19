import { UnauthorizedException } from '@nestjs/common';
import { Roles as Rol } from 'src/common/enums/roles.enum';
import { Errores_Roles } from 'src/common/helpers/roles.helpers';
import { User_Interface } from 'src/common/interfaces/user.interface';

export function validateUser(user: User_Interface) {
  if (user.role !== Rol.USUARIO) {
    throw new UnauthorizedException(Errores_Roles.ROLE_UNAUTHORIZED);
  } else {
    return true;
  }
}

export function validateAdmin(user: User_Interface) {
  if (user.role !== Rol.ADMIN) {
    throw new UnauthorizedException(Errores_Roles.ROLE_UNAUTHORIZED);
  } else {
    return true;
  }
}

export function validateAll(user: User_Interface) {
  if (user.role === Rol.ADMIN) {
    return true;
  }

  if (user.role === Rol.USUARIO) {
    return true;
  }

  if (user.role !== Rol.ADMIN && user.role !== Rol.USUARIO) {
    return {
      status: 401,
      message: Errores_Roles.ROLE_UNAUTHORIZED
    }
  }
}
