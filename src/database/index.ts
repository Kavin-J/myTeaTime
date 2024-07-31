import { connect, Connection, ConnectOptions, set } from 'mongoose';
import { NODE_ENV, DB_HOST, DB_DATABASE, DB_USER, DB_PASSWORD, DB_OPTIONS } from '@config';

export const dbConnection = async () => {
  const dbConfig = {
    url: `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}?${DB_OPTIONS}`,
  };

  if (NODE_ENV !== 'production') {
    set('debug', true);
  }

  await connect(dbConfig.url);
};
