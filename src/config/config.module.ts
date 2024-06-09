import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ConfigService } from './config.service';

@Global()
@Module({
  exports: [ConfigService],
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
  providers: [ConfigService],
})
export class ConfigModule {}
