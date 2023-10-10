import express from 'express';
import {
  patchProfileValidators,
  resetPasswordValidators,
} from '../validators/user_validator';
import {checkValidatorResult, verifyUser} from './util';
import {
  getProfileHandler,
  logoutHandler,
  patchProfileHandler,
  resetPasswordHandler,
} from '../controllers/user_controller';

export const userRouter = express.Router();

userRouter.use(verifyUser);

userRouter.get('/profile', getProfileHandler);

userRouter.patch(
  '/profile',
  patchProfileValidators,
  checkValidatorResult,
  patchProfileHandler
);

userRouter.post(
  '/reset-password',
  resetPasswordValidators,
  checkValidatorResult,
  resetPasswordHandler
);

userRouter.post('/logout', logoutHandler);
