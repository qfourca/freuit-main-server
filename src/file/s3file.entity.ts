import { Column, Entity, PrimaryColumn, Repository } from 'typeorm';

@Entity({ name: 's3_file' })
export class S3FileData {
  @PrimaryColumn('char', { length: 40 })
  hash: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  last_edited: Date;

  @Column('varchar', { nullable: true })
  content_type: string;
}

export type DbFileDataRepository = Repository<S3FileData>;
