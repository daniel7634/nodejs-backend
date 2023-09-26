import express from 'express';
import passport from 'passport';
import passportGoogleOAuth2 from 'passport-google-oauth20';
import 'dotenv/config';

const router = express.Router();

passport.use(
  new passportGoogleOAuth2.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `http://${process.env.DOMAIN}:${process.env.PORT}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    }
  )
);

router.get(
  '/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
);

// 處理 Google OAuth 2.0 回調
router.get(
  '/google/callback',
  passport.authenticate('google', {failureRedirect: '/', session: false}),
  (req, res) => {
    res.send('Login success');
  }
);

export default router;
