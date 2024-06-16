import { config as loadConfig } from 'dotenv';
import { join } from 'path';

loadConfig({
  path: join(
    __dirname,
    process.env.NODE_ENV === 'production'
      ? '../config/prod.env'
      : '../config/dev.env',
  ),
});

import { DataSource } from 'typeorm';
console.log(process.env.DATABASE_DB);
export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_DB,
  entities: ['dist/src/**/*.entity.js'],
  synchronize: !(process.env.NODE_ENV === 'production'),
  migrations: ['dist/database/migrations/*.js'],
});
