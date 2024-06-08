import { Column, Entity, PrimaryColumn, Repository } from 'typeorm';

@Entity({ name: 'project' })
export class Project {
  @PrimaryColumn({ length: 16 })
  uuid: string;

  @Column('text')
  title: string;

  @Column('text')
  thumbnail: string;
}

export type ProjectRepository = Repository<Project>;
