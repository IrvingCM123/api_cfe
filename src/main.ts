import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true} );
  const logger = new Logger('bootstrap');

  app.enableCors();
  app.setGlobalPrefix('listener');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('API CFE')
    .setDescription('API para el control de medidores de CFE')
    .setVersion('1.0')
    .addTag('medidores')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  await app.listen(3000);
  logger.log(`App running on port 3000`);
}
bootstrap();
