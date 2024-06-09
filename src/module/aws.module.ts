import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { Logger, Module } from '@nestjs/common';
import { AwsSdkModule } from 'aws-sdk-v3-nest';
import { ConfigService } from 'src/config/config.service';

@Module({
  imports: [
    AwsSdkModule.registerAsync({
      inject: [ConfigService],
      clientType: S3Client,
      useFactory: async (conf: ConfigService) => {
        const logger = new Logger('InitAwsS3');
        const awsCof = conf.awsConfig;
        const s3 = new S3Client({
          region: awsCof.reigon,
          credentials: {
            accessKeyId: awsCof.s3.accessKey,
            secretAccessKey: awsCof.s3.secretKey,
          },
        });
        try {
          const listCommand = new ListBucketsCommand({});
          await s3.send(listCommand);
          logger.log('Connected to S3');
        } catch (e) {
          logger.error('Unable to connect to S3', e);
        }
        return s3;
      },
    }),
  ],
  exports: [AwsSdkModule],
})
export class AwsModule {}
