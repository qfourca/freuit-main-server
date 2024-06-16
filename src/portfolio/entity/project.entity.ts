import { transformer } from 'src/file/s3file.entity';
import { Column, Entity, PrimaryColumn, Repository } from 'typeorm';

@Entity({ name: 'project' })
export class Project {
  @PrimaryColumn('char', { length: 36 })
  uuid: string;

  @Column('text')
  title: string;

  @Column('bytea', { transformer: transformer })
  thumbnail: string;
}

export type ProjectRepository = Repository<Project>;
