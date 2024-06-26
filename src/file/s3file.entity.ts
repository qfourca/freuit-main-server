import { Column, Entity, PrimaryColumn, Repository } from 'typeorm';

export const transformer = {
  to: (v: string) => Buffer.from(v, 'base64'),
  from: (b: Buffer) => b.toString('base64'),
};

@Entity({ name: 's3_file' })
export class S3FileData {
  @PrimaryColumn('bytea')
  hash: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  last_edited: Date;

  @Column('varchar', { nullable: true })
  content_type: string;
}

export type DbFileDataRepository = Repository<S3FileData>;
