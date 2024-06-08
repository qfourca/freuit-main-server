import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectRepository } from './entity/project.entity';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: ProjectRepository,
    private readonly httpService: HttpService,
  ) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public syncProject(project: Project): string {
    this.projectRepository.save(project);

    return 'SUCCESS';
  }

  public fetchProjectFromNotion() {
    // this.httpService.post(`https://api.notion.com/v1/databases/${id}/query`);
  }
}
