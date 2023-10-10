import express from 'express';
import passport from 'passport';
import 'dotenv/config';
import {
  acceptDataValidator,
  registerValidators,
  loginValidators,
} from '../validators/auth_validator';
import {checkValidatorResult} from './util';
import {
  acceptHandler,
  googleCallbackHandler,
  loginHandler,
  registerHandler,
  resendEmailHandler,
} from '../controllers/auth_controller';

export const authRouter = express.Router();

authRouter.get(
  '/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {failureRedirect: '/', session: false}),
  googleCallbackHandler
);

authRouter.post(
  '/register',
  registerValidators,
  checkValidatorResult,
  registerHandler
);

authRouter.post('/login', loginValidators, checkValidatorResult, loginHandler);

authRouter.get(
  '/accept',
  acceptDataValidator(),
  checkValidatorResult,
  acceptHandler
);

authRouter.post('/resend-email', resendEmailHandler);
