import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import {createVerifiedUser} from '../repos/user/user_create_repo';

passport.use(
  new GoogleStrategy.Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: `${process.env.HOST}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile: GoogleStrategy.Profile, cb) => {
      if (!profile.emails || !profile.emails[0].value) {
        return cb(new Error('There is no email'), profile);
      } else {
        await createVerifiedUser(profile.displayName, profile.emails[0].value);
        return cb(null, profile);
      }
    }
  )
);

export default passport;
