import { Module } from "@nestjs/common";
import { DB_CONNECTION } from "src/constants/constants";
import { Pool } from 'pg';

const dbProvider = {
  provide: DB_CONNECTION,
  useValue: new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  }),
}

@Module({
  providers: [dbProvider],
  exports: [dbProvider]
})
export class DbModule {}