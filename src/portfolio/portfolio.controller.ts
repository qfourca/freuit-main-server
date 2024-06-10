import { Controller, Get, Logger, Post } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { FileService } from 'src/file/file.service';

@Controller('portfolio')
export class PortfolioController {
  private readonly logger = new Logger(PortfolioController.name);
  constructor(
    private readonly service: PortfolioService,
    private readonly filemod: FileService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    return 'Hello World';
  }

  @Post('project')
  public async syncProject(): Promise<string> {
    try {
      const projects = (await this.service.getProjectFromNotion()).data;
      return await this.service.saveProject(projects);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
