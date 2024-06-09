import { Module } from '@nestjs/common';

import { FileService } from './file.service';
import { httpModule } from 'src/module/http.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3FileData } from './s3file.entity';
import { LOCAL_DB_NAME } from 'src/module/localdb.module';
import { AwsModule } from 'src/module/aws.module';
import { TempFileData } from './tmpfile.entity';

@Module({
  imports: [
    httpModule,
    AwsModule,
    TypeOrmModule.forFeature([S3FileData]),
    TypeOrmModule.forFeature([TempFileData], LOCAL_DB_NAME),
  ],
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}
