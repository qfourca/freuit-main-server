import { Entity, PrimaryGeneratedColumn, Repository } from 'typeorm';

@Entity({ name: 'tmp_file' })
export class TempFileData {
  @PrimaryGeneratedColumn('increment')
  id: string;
}

export type TempFileDataRepository = Repository<TempFileData>;
