import { Controller, Get, Post } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { FileService } from 'src/file/file.service';

@Controller('portfolio')
export class PortfolioController {
  constructor(
    private readonly service: PortfolioService,
    private readonly filemod: FileService,
  ) {}

  @Get()
  async getHello(): Promise<string> {
    await this.filemod.saveFile(
      'https://www.next-t.co.kr/public/uploads/7b7f7e2138e29e598cd0cdf2c85ea08d.jpg',
    );
    return this.service.getHello();
  }

  @Post('project')
  public async syncProject(): Promise<string> {
    const projects = (await this.service.getProjectFromNotion()).data;
    return await this.service.saveProject(projects);
  }
}
