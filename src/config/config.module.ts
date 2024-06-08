import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { join } from 'path';

@Module({
  imports: [
    NestConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: join(
        'src/config',
        process.env.NODE_ENV === 'production' ? 'prod.env' : 'dev.env',
      ),
    }),
  ],
})
export class ConfigModule {}
