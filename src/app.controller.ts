import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ActiveUser } from './common/decorators/user.decorator';
import { User_Interface } from './common/interfaces/user.interface';
import { Auth } from './auth/decorators/auth.decorator';
import { Roles } from 'src/common/enums/roles.enum';

@Auth(Roles.USUARIO)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('validar_token')
  validar_Token(@ActiveUser() user: User_Interface){
    return this.appService.validar_Token(user);
  }

}
