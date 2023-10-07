import path from 'path';

import express, {Request, Response, NextFunction} from 'express';
import 'dotenv/config';
import 'express-async-errors';
import {StatusCodes, getReasonPhrase} from 'http-status-codes';

import authRouter from './routes/auth-route';
import userRouter from './routes/user-route';
import dashboardRouter from './routes/dashboard-route';
import {isUserVerified} from './repo/user-repo';
import {RouteError} from './error';
import session from './middlewares/session/session';
import {getEmailFromSession} from './middlewares/session/util';
import passport from './middlewares/passport';

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
const viewsDir = path.join(__dirname, '../views');

// Setup middlewares
app.use(session);
app.use(passport.initialize());

// Setup express router
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/dashboard', dashboardRouter);

async function checkUserVerified(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const email = getEmailFromSession(req);
  if (email && (await isUserVerified(email))) {
    next();
  } else {
    res.redirect('/landing');
  }
}

app.get('/', checkUserVerified, async (req: Request, res: Response) => {
  res.sendFile('dashboard.html', {root: viewsDir});
});

app.get('/landing', (req: Request, res: Response) => {
  res.sendFile('landing.html', {root: viewsDir});
});

app.get('/profile', checkUserVerified, async (req: Request, res: Response) => {
  res.sendFile('profile.html', {root: viewsDir});
});

// An error handler that takes care of any errors that might be encountered in the app
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof RouteError) {
    res.status(err.status).json({error: err.message});
  } else {
    console.error(err.message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)});
  }
});

app.listen(port, () => {
  console.log(`Server is listening at port:${port}`);
});
