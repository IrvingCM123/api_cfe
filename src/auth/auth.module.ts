import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsuarioModule } from 'src/resource/usuario/usuario.module';
import { CuentasModule } from 'src/resource/cuentas/cuentas.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwt.constant';
import { ClientModule } from 'src/client/client.module';
import { TransaccionModule } from 'src/common/transaction/transaccion.module';

@Module({
  imports: [
    UsuarioModule,
    CuentasModule,
    ClientModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
    TransaccionModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
