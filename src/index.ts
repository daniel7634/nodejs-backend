import path from 'path';

import express, {Request, Response, NextFunction} from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import 'dotenv/config';
import session from 'express-session';

import authRouter from './routes/auth';
import {createGoogleUserIfNotExist, getUser} from './repo';

const app = express();
const port = process.env.PORT || 3000;
const viewsDir = path.join(__dirname, '../views');

// session
declare module 'express-session' {
  interface SessionData {
    email: string;
  }
}

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    saveUninitialized: false,
    resave: true,
  })
);

// passport
passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `http://${process.env.DOMAIN}:${process.env.PORT}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile: GoogleStrategy.Profile, cb) => {
      if (!profile.emails) {
        return cb(new Error('There is no email'), profile);
      } else {
        await createGoogleUserIfNotExist(
          profile.displayName,
          profile.emails[0].value
        );
        return cb(null, profile);
      }
    }
  )
);
app.use(passport.initialize());
app.use(express.json());

app.use('/auth', authRouter);

async function auth(req: Request, res: Response, next: NextFunction) {
  if (req.session.email) {
    const user = await getUser(req.session.email);
    if (user) {
      if (user.isVerified) {
        next();
      } else {
        res.send('Check verification in your email box');
      }
    } else {
      res.sendFile('login.html', {root: viewsDir});
    }
  } else {
    res.sendFile('login.html', {root: viewsDir});
  }
}

app.post('/logout', auth, (req: Request, res: Response) => {
  req.session.destroy(() => {
    console.log('session destroyed');
  });
  res.send('Logout successful');
});

app.get('/', auth, (req: Request, res: Response) => {
  return res.sendFile('dashboard.html', {root: viewsDir});
});

app.listen(port, () => {
  console.log(`Server is listening at prot:${port}`);
});
