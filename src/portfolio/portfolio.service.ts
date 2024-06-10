import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectRepository } from './entity/project.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { List } from 'notion-api-types/endpoints/global';
import NotionPage from 'package/notion/page';
import { ConfigKey } from 'src/config/configKey';
import { FileService } from 'src/file/file.service';

@Injectable()
export class PortfolioService {
  constructor(
    @InjectRepository(Project)
    private readonly projRep: ProjectRepository,
    private readonly confSer: ConfigService,
    private readonly httpSer: HttpService,
    private readonly fileSer: FileService,
  ) {}

  public async saveProject(projects: Array<Project>): Promise<number> {
    try {
      const files = await Promise.all(
        projects.map(({ thumbnail }) => this.fileSer.saveFile(thumbnail)),
      );
      files.forEach((file, idx) => {
        projects[idx].thumbnail = file.hash;
      });
      return (await this.projRep.save(projects)).length;
    } catch (e) {
      throw e;
    }
  }

  public async getProjectFromDb(): Promise<Array<Project>> {
    const projects = await this.projRep.find();
    const files = await Promise.all(
      projects.map(({ thumbnail }) => {
        return this.fileSer.hashToUrl(thumbnail, 60);
      }),
    );
    files.forEach((file, idx) => {
      projects[idx].thumbnail = file;
    });
    return projects;
  }

  public async getProjectFromNotion(): Promise<Array<Project>> {
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
    const data = (await firstValueFrom(notionProjects.pipe())).data;
    const projects: Array<Project> = [];
    data.results.forEach((pro: NotionPage) => {
      if (pro.object === 'page' && pro.cover.type === 'file') {
        let title: string | undefined;
        Object.keys(pro.properties).forEach((key) => {
          const property = pro.properties[key];
          if (property.type === 'title') title = property.title[0].plain_text;
        });
        if (title) {
          projects.push({
            uuid: pro.id,
            title: title,
            thumbnail: pro.cover.file.url,
          });
        }
      }
    });
    return projects;
  }
}
