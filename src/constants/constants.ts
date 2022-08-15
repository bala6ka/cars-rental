import * as dotenv from 'dotenv';
dotenv.config();

export const DB_CONFIG = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

export const BASE_COST = {
  BASE: 1000,
}

export const DISCOUNT_PER_DAYS = [
  { from: 0, to: 4, discount: 0 },
  { from: 4, to: 9, discount: 5 },
  { from: 9, to: 17, discount: 10 },
  { from: 18, to: 29, discount: 15 },
]

export const DB_CONNECTION = 'DB_CONNECTION';