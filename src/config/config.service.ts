import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';
import { ConfigKey } from './configKey';
import { join } from 'path';

@Injectable()
export class ConfigService extends NestConfigService {
  public get isProd() {
    return this.get('NODE_ENV') === 'production';
  }

  public get remoteDbConfig() {
    return {
      host: this.get(ConfigKey.DATABASE_HOST),
      port: this.get(ConfigKey.DATABASE_PORT),
      username: this.get(ConfigKey.DATABASE_USER),
      password: this.get(ConfigKey.DATABASE_PASSWORD),
      database: this.get(ConfigKey.DATABASE_DB),
    };
  }

  public get awsConfig() {
    return {
      reigon: this.get('AWS_REGION'),
      s3: {
        bucket: this.get('AWS_S3_BUCKET'),
        accessKey: this.get('AWS_S3_ACCESS_KEY'),
        secretKey: this.get('AWS_S3_SECRET_KEY'),
      },
    };
  }

  public path(...paths: string[]) {
    return join(this.get(ConfigKey.FILE_DIRECTORY), ...paths);
  }
}
