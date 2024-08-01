import { config } from 'dotenv';
config({path : `.env.${process.env.NODE_ENV}.local`});

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN ,EXPIREIN} = process.env;
export const { DB_HOST, DB_DATABASE , DB_USER , DB_PASSWORD , DB_OPTIONS } = process.env;
