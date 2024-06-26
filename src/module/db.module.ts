import { Module } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        ...configService.remoteDbConfig,
        synchronize: configService.get('DATABASE_SYNC'),
        autoLoadEntities: true,
      }),
    }),
  ],
})
export class DatabaseModule {}
