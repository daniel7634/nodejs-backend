import path from 'path';

import express, {Request, Response} from 'express';
import passport from 'passport';
import 'dotenv/config';

import authRouter from './routes/auth';

const app = express();
const port = process.env.PORT || 3000;
const viewsDir = path.join(__dirname, '../views');

app.use(passport.initialize());
app.use('/auth', authRouter);

app.use('/', (req: Request, res: Response) => {
  console.log('root');
  return res.sendFile('login.html', {root: viewsDir});
});

app.listen(port, () => {
  console.log(`Server is listening at prot:${port}`);
});
