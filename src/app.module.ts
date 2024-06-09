import { Module } from '@nestjs/common';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './module/db.module';
import { LocalDatabaseModule } from './module/localdb.module';
import { AwsModule } from './module/aws.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    LocalDatabaseModule,
    AwsModule,
    PortfolioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
