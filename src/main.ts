import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );
  //app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix('api/v1');
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  //app.enableCors();
  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0', () =>
    console.log(`Listening on port: ${port}`),
  );
}

bootstrap();
