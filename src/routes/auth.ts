import {v4 as uuidv4} from 'uuid';
import express, {Request, Response} from 'express';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import 'dotenv/config';
import bcrypt from 'bcrypt';
import {
  registerEmailValidator,
  registerPasswordValidator,
  loginEmailValidator,
  loginPasswordValidator,
  acceptDataValidator,
} from '../validators/authValidator';
import {acceptRegistration, createUserWithToken, getUser} from '../repo';
import {checkValidatorResult} from './util';
import {sendVerificationEmail} from '../emailer';

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

interface RegisterPostData {
  email: string;
  password: string;
}

router.post(
  '/register',
  registerEmailValidator(),
  registerPasswordValidator(),
  checkValidatorResult,
  async (req: Request<{}, {}, RegisterPostData>, res) => {
    try {
      const postData: RegisterPostData = req.body;

      const user = await getUser(postData.email);
      if (user) {
        return res.status(400).json({message: 'Email already exists'});
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(postData.password, saltRounds);

      const token = uuidv4();
      await createUserWithToken(postData.email, hashedPassword, token);
      sendVerificationEmail(postData.email, token);

      return res.status(201).json({message: 'Register successful'});
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Internal server error'});
    }
  }
);

interface LoginPostData {
  email: string;
  password: string;
}

router.post(
  '/login',
  loginEmailValidator(),
  loginPasswordValidator(),
  checkValidatorResult,
  async (req: Request<{}, {}, LoginPostData>, res: Response) => {
    try {
      const postData: LoginPostData = req.body;

      const user = await getUser(postData.email);
      if (!user || !user.password) {
        return res.status(401).json({message: 'Invalid email or password'});
      }

      const passwordMatch = await bcrypt.compare(
        postData.password,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
      }

      if (!user.isVerified) {
        return res.send('Check verification in your email box');
      } else {
        req.session.email = user.email;
        return res.json({message: 'Login successful'});
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Internal server error'});
    }
  }
);

interface AcceptQueryData {
  token?: string;
}

router.get(
  '/accept',
  acceptDataValidator(),
  checkValidatorResult,
  async (req: Request<{}, {}, {}, AcceptQueryData>, res: Response) => {
    try {
      const queryData: AcceptQueryData = req.query;
      if (queryData.token) {
        const user = await acceptRegistration(queryData.token);
        if (user) {
          req.session.email = user.email;
          return res.redirect('/');
        }
      }
      return res.send('Email verification has expired');
    } catch (error) {
      console.error(error);
      return res.status(500).json({message: 'Internal server error'});
    }
  }
);

export default router;
