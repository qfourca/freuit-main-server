import { Controller, Get, Post } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { ConfigService } from '@nestjs/config';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly service: PortfolioService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.service.getHello();
  }

  @Post('project')
  public syncProject(): string {
    this.service.fetchProjectFromNotion();

    return 'SUCCESS';
  }
}
