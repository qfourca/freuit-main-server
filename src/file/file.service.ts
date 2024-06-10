import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import * as fs from 'fs';
import { pipeline } from 'stream/promises';
import { ConfigService } from 'src/config/config.service';
import { InjectRepository } from '@nestjs/typeorm';
import { S3FileData, DbFileDataRepository } from './s3file.entity';
import { LOCAL_DB_NAME } from 'src/module/localdb.module';
import * as crypto from 'crypto';
import { InjectAws } from 'aws-sdk-v3-nest';
import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigKey } from 'src/config/configKey';
import { TempFileData, TempFileDataRepository } from './tmpfile.entity';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export type SaveableFile = string;

@Injectable()
export class FileService {
  private readonly s3Folder: string;
  private readonly logger = new Logger(FileService.name);
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    @InjectRepository(TempFileData, LOCAL_DB_NAME)
    private readonly tmpFileRep: TempFileDataRepository,
    @InjectRepository(S3FileData)
    private readonly dbFileRep: DbFileDataRepository,
    @InjectAws(S3Client)
    private readonly s3Client: S3Client,
  ) {
    this.s3Folder = config.get(ConfigKey.FILE_DIRECTORY);
  }

  public async saveFile(file: SaveableFile): Promise<S3FileData> {
    let upscopeId: string = '';
    try {
      const { id, path, type } = await this.downloadFile(file);
      upscopeId = id;
      const hash = await this.calculateHash(path);
      const isExist = await this.dbFileRep.existsBy({ hash });
      if (!isExist) {
        await this.uploadFileToS3(path, hash, type);
        await this.dbFileRep.insert({ hash, content_type: type });
      }
      return await this.dbFileRep.findOneBy({ hash });
    } catch (e) {
      this.logger.error(e);
    } finally {
      if (upscopeId !== '')
        await this.tmpFileRep.update({ id: upscopeId }, { delete: true });
    }
  }

  public async hashToUrl(hash: string, expire: number = 15): Promise<any> {
    const command = new GetObjectCommand({
      Bucket: this.config.awsConfig.s3.bucket,
      Key: this.s3Folder + '/' + hash,
    });
    try {
      return await getSignedUrl(this.s3Client, command, {
        expiresIn: expire * 60,
      });
    } catch (error) {
      throw null;
    }
  }

  private async downloadFile(
    file: SaveableFile,
  ): Promise<{ id: string; path: string; type?: string }> {
    try {
      if (typeof file === 'string') {
        const data = await firstValueFrom(
          this.http.get(file, { responseType: 'stream' }),
        );
        if (data.config.responseType === 'stream') {
          const res = await this.tmpFileRep.insert({});
          const path = this.config.path('tmp', String(res.raw));
          await pipeline(data.data, fs.createWriteStream(path));
          return {
            id: String(res.raw),
            path,
            type: String(
              data.headers['content-type'] ?? data.headers['Content-Type'],
            ),
          };
        } else {
          throw 'NO STREAM';
        }
      } else {
        throw 'TYPE';
      }
    } catch (error) {
      throw error;
    }
  }

  private calculateHash(path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(path);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (error) => reject(error));
    });
  }

  private async uploadFileToS3(
    filePath: string,
    keyName: string,
    type?: string,
  ) {
    const fileStream = fs.createReadStream(filePath);
    const command = new PutObjectCommand({
      Bucket: this.config.awsConfig.s3.bucket,
      Key: this.s3Folder + '/' + keyName,
      Body: fileStream,
      ContentType: type,
      ACL: 'bucket-owner-full-control',
    });
    try {
      return await this.s3Client.send(command);
    } catch (error) {
      throw null;
    }
  }
}
