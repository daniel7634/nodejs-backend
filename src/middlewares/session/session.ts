import * as sessionNameSpace from 'express-session';
import MySQLStoreFactory from 'express-mysql-session';
import session from 'express-session';

const MySQLStore = MySQLStoreFactory(sessionNameSpace);
const options = {
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  schema: {
    tableName: 'sessions',
    columnNames: {
      session_id: 'session_id',
      expires: 'expires',
      data: 'data',
    },
  },
};

const sessionMySQLStore = new MySQLStore(options);
sessionMySQLStore
  .onReady()
  .then(() => {
    console.log('Session MySQLStore is ready');
  })
  .catch(error => {
    console.error(error);
  });

export const mysqlSession = session({
  secret: process.env.SESSION_SECRET as string,
  store: sessionMySQLStore,
  resave: false,
  saveUninitialized: false,
});
