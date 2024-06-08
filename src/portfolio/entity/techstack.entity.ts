import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Techstack {
  @PrimaryColumn()
  uuid: string;

  @Column()
  title: string;

  @Column()
  thumbnail: string;
}
