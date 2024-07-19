import { Roles as Rol } from '../../common/enums/roles.enum';
import { SetMetadata } from "@nestjs/common"; 

export const Roles_Key = 'roles';

export const Roles = (rol: Rol) => SetMetadata(Roles_Key, rol);
