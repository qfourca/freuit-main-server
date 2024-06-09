import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectRepository } from './entity/project.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { List } from 'notion-api-types/endpoints/global';
import NotionPage from 'package/notion/page';
import { ConfigKey } from 'src/config/configKey';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Project)
    private readonly projRep: ProjectRepository,
    private readonly confSer: ConfigService,
    private readonly httpSer: HttpService,
  ) {}

  public getHello(): string {
    return 'Hello World!';
  }

  public async saveProject(projects: List<NotionPage>): Promise<string> {
    const insertableProject: Array<Project> = [];

    projects.results.forEach((pro: NotionPage) => {
      if (pro.object === 'page' && pro.cover.type === 'file') {
        let title: string | undefined;
        Object.keys(pro.properties).forEach((key) => {
          const property = pro.properties[key];
          if (property.type === 'title') title = property.title[0].plain_text;
        });
        if (title) {
          insertableProject.push({
            uuid: pro.id,
            title: title,
            thumbnail: pro.cover.file.url,
          });
        }
      }
    });
    await this.projRep.save(insertableProject);
    return 'SUCCESS';
  }

  public async getProjectFromNotion(): Promise<
    AxiosResponse<List<NotionPage>>
  > {
    const token = this.confSer.get(ConfigKey.NOTION_KEY);
    const id = this.confSer.get(ConfigKey.NOTION_PROJECT_KEY);

    const notionProjects = this.httpSer.post<List<NotionPage>>(
      `https://api.notion.com/v1/databases/${id}/query`,
      {},
      {
        headers: {
          'Notion-Version': '2022-06-28',
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const data = await firstValueFrom(notionProjects.pipe());

    return data;
  }
}
