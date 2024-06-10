import { Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Project } from './entity/project.entity';

@Controller('portfolio')
export class PortfolioController {
  private readonly logger = new Logger(PortfolioController.name);
  constructor(private readonly service: PortfolioService) {}

  @Get()
  async getHello(): Promise<string> {
    return 'Hello World';
  }

  @Post('project')
  public async syncProject(): Promise<string> {
    try {
      const projects = await this.service.getProjectFromNotion();
      const updates = await this.service.saveProject(projects);
      return String(updates);
    } catch (e) {
      this.logger.error(e);
      return 'ERROR';
    }
  }

  @Get('project')
  public async getProject(
    @Query('origin') origin?: string,
  ): Promise<Array<Project>> {
    try {
      origin = origin ?? '';
      return origin.toLowerCase() === 'notion'
        ? await this.service.getProjectFromNotion()
        : await this.service.getProjectFromDb();
    } catch (e) {
      this.logger.error(e);
    }
  }
}
