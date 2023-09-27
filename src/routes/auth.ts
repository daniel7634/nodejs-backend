import express from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import 'dotenv/config';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
);

router.get(
  '/google/callback',
  passport.authenticate('google', {failureRedirect: '/', session: false}),
  (req, res) => {
    const user = req.user as GoogleStrategy.Profile;
    if (user.emails) {
      req.session.email = user.emails[0].value;
    }
    res.redirect('/');
  }
);

export default router;
