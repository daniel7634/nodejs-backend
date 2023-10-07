import express from 'express';
import {
  profileNameValidator,
  resetPasswordValidators,
} from '../validators/user_validator';
import {checkValidatorResult, verifyUser} from './util';
import {
  getProfileHandler,
  logoutHandler,
  patchProfileHandler,
  resetPasswordHandler,
} from '../controllers/user_controller';

const router = express.Router();

router.use(verifyUser);

router.get('/profile', getProfileHandler);

router.patch(
  '/profile',
  profileNameValidator(),
  checkValidatorResult,
  patchProfileHandler
);

router.post(
  '/reset-password',
  resetPasswordValidators,
  checkValidatorResult,
  resetPasswordHandler
);

router.post('/logout', logoutHandler);

export default router;