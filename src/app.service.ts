import { Injectable } from '@nestjs/common';
import { User_Interface } from './common/interfaces/user.interface';
import { validateAll } from './auth/guard/validateRole.guard';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  validar_Token(user: User_Interface){
    
    const validar = validateAll(user);

    if (validar == true) {
      return {
        status: 201
      }
    } else {
      return {
        status: 401
      }
    }
  }
}
