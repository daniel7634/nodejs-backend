import express, {Request, Response, NextFunction} from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import {
  registerEmailValidator,
  getValidateErrorMsg,
  registerPasswordValidator,
  loginEmailValidator,
  loginPasswordValidator,
} from '../validator';
import {sendVerificationEmail} from '../emailer';

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

function checkValidatorResult(req: Request, res: Response, next: NextFunction) {
  const validateErrorMsg = getValidateErrorMsg(req);
  if (validateErrorMsg) {
    res.status(400).json({msg: validateErrorMsg});
  } else {
    next();
  }
}

interface RegisterBody {
  email: string;
  password: string;
}

router.post(
  '/register',
  registerEmailValidator(),
  registerPasswordValidator(),
  checkValidatorResult,
  async (req: Request<{}, {}, RegisterBody>, res) => {
    try {
      const postData: RegisterBody = req.body;
      if (users.find(user => user.email === postData.email)) {
        return res.status(400).json({message: 'Email already exists'});
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(postData.password, saltRounds);

      users.push({email: postData.email, password: hashedPassword});
      await sendVerificationEmail(postData.email, 'testtoken');

      return res.status(201).json({message: 'Registration successful'});
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Internal server error'});
    }
  }
);

router.post(
  '/login',
  loginEmailValidator(),
  loginPasswordValidator(),
  async (req, res) => {
    try {
      const {email, password} = req.body;

      const user = users.find(user => user.email === email);

      if (!user) {
        return res.status(401).json({message: 'Invalid email or password'});
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
      }

      req.session.email = email;
      return res.json({message: 'Login successful'});
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Internal server error'});
    }
  }
);

export default router;
