import { Column, Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';

@Entity({ name: 'tmp_file' })
export class TempFileData {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column('boolean', { default: () => false })
  delete: boolean;
}

export type TempFileDataRepository = Repository<TempFileData>;
