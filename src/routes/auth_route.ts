import express from 'express';
import passport from 'passport';
import 'dotenv/config';
import {
  registerEmailValidator,
  registerPasswordValidator,
  loginEmailValidator,
  loginPasswordValidator,
  acceptDataValidator,
} from '../validators/auth_validator';
import {checkValidatorResult} from './util';
import {
  acceptHandler,
  googleCallbackHandler,
  loginHandler,
  registerHandler,
  resendEmailHandler,
} from '../controllers/auth_controller';

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {scope: ['profile', 'email']})
);

router.get(
  '/google/callback',
  passport.authenticate('google', {failureRedirect: '/', session: false}),
  googleCallbackHandler
);

router.post(
  '/register',
  registerEmailValidator(),
  registerPasswordValidator(),
  checkValidatorResult,
  registerHandler
);

router.post(
  '/login',
  loginEmailValidator(),
  loginPasswordValidator(),
  checkValidatorResult,
  loginHandler
);

router.get(
  '/accept',
  acceptDataValidator(),
  checkValidatorResult,
  acceptHandler
);

router.post('/resend-email', resendEmailHandler);

export default router;
