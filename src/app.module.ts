import { Module } from '@nestjs/common';
import { PortfolioModule } from './portfolio/portfolio.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './module/db.module';

@Module({
  imports: [ConfigModule, DatabaseModule, PortfolioModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
