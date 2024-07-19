import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core'; 
import { Roles } from 'src/common/enums/roles.enum';
import { Roles_Key } from '../decorators/roles.decorator';
import { Errores_Roles } from 'src/common/helpers/roles.helpers';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private readonly reflector: Reflector) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = await this.reflector.getAllAndOverride<Roles>(Roles_Key, [
      context.getHandler(),
      context.getClass(),
    ]);

    const user = await context.switchToHttp().getRequest().user;

    if (!user) {
      throw new UnauthorizedException(Errores_Roles.ROLE_NOT_FOUND);
    }

    let validar = false;
    
    const valoresEnum = Object.values(Roles);
    for (let valor of valoresEnum) {
      if (user.role === valor) {
        return (validar = true);
      } else {
        validar = false;
      }
    }

    if (validar === false) {
      throw new UnauthorizedException(Errores_Roles.ROLE_INVALID);
    }

    return roles === user.role; 
  }
}
