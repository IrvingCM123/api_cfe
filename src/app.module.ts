import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CuentasModule } from './resource/cuentas/cuentas.module';
import { UsuarioModule } from './resource/usuario/usuario.module';
import { ClientModule } from './client/client.module';
import { MedidoresTempModule } from './resource/medidores_temp/medidores_temp.module';

const dotenv = require('dotenv').config();
const secret = dotenv.parsed;

const host_database = secret.DB_HOST;
const port_database = secret.DB_PORT;
const user_database = secret.DB_USER;
const password_database = secret.DB_PASS;
const name_database = secret.DB_NAME;

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: host_database,
      port: port_database,
      username: user_database,
      password: password_database,
      database: name_database,
      autoLoadEntities: true,
      synchronize: true,
      extra: {
        ssl: true,
        sslmode: 'require',
      },
    }),
    AuthModule,
    CuentasModule,
    UsuarioModule,
    ClientModule,
    MedidoresTempModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
