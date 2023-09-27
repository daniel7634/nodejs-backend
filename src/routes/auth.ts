import express, {Request} from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import 'dotenv/config';

const users: {email: string; password: string}[] = [];
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

interface registerBody {
  email: string;
  password: string;
}

router.post('/register', async (req: Request<{}, {}, registerBody>, res) => {
  try {
    const email = req.body.email.trim();
    const password = req.body.password.trim();

    if (!email || !password) {
      return res.status(400).json({message: 'Email and password are requred'});
    }

    if (users.find(user => user.email === email)) {
      return res.status(400).json({message: 'Email already exists'});
    }

    users.push({email, password: password});

    return res.status(201).json({message: 'Registration successful'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Internal server error'});
  }
});

router.post('/login', async (req, res) => {
  try {
    const {email, password} = req.body;

    const user = users.find(user => user.email === email);

    if (!user) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    const passwordMatch = password === user.password;

    if (!passwordMatch) {
      return res.status(401).json({message: 'Invalid email or password'});
    }

    console.log(req.session);
    req.session.email = email;

    return res.json({message: 'Login successful'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Internal server error'});
  }
});

export default router;
