import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { mkdir } from 'fs/promises';

async function bootstrap() {
  try {
    await mkdir('./fs');
    await mkdir('./fs/tmp');
  } catch {}
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  await app.listen(+process.env.APP_PORT ?? 3000);
}
bootstrap();
