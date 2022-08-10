import * as dotenv from 'dotenv';
dotenv.config();

export const DB_CONFIG = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

export const DISCONT = {
  MEDIUM: 5,
  GOLD: 10,
  PLATINUM: 15,
}

export const DB_CONNECTION = 'DB_CONNECTION';