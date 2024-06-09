import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'src/config/config.service';
import { TempFileData } from 'src/file/tmpfile.entity';

export const LOCAL_DB_NAME = 'local';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      name: LOCAL_DB_NAME,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'sqlite',
        database: config.path('db.db'),
        synchronize: true,
        entities: [TempFileData],
      }),
    }),
  ],
})
export class LocalDatabaseModule {}
