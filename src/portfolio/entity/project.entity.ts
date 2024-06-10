import { HashByteaColumn, S3FileData } from 'src/file/s3file.entity';
import { Column, Entity, OneToOne, PrimaryColumn, Repository } from 'typeorm';

@Entity({ name: 'project' })
export class Project {
  @PrimaryColumn('char', { length: 36 })
  uuid: string;

  @Column('text')
  title: string;

  @OneToOne(() => S3FileData)
  @HashByteaColumn({ nullable: true })
  thumbnail: string;
}

export type ProjectRepository = Repository<Project>;
