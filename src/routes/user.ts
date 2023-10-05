import express, {Request, Response, NextFunction} from 'express';
import {isUserVerified} from '../repo';
import {
  profileNameValidator,
  resetPasswordValidators,
} from '../validators/user-validator';
import {checkValidatorResult} from './util';
import {RouteError} from '../error';
import {StatusCodes} from 'http-status-codes';
import {resetPassword, updateProfile} from '../services/user-service';

const router = express.Router();

router.use(verifyUser);

async function verifyUser(req: Request, res: Response, next: NextFunction) {
  if (req.session.email && (await isUserVerified(req.session.email))) {
    next();
  } else {
    throw new RouteError(StatusCodes.UNAUTHORIZED, 'User is not verified');
  }
}

interface ProfilePostData {
  name: string;
}

router.patch(
  '/profile',
  profileNameValidator(),
  checkValidatorResult,
  async (req: Request<{}, {}, ProfilePostData>, res: Response) => {
    const postData: ProfilePostData = req.body;

    await updateProfile(req.session.email as string, postData.name);

    res.json({message: 'Update successful'});
  }
);

interface ResetPasswordPostData {
  oldPassword: string;
  newPassword: string;
}

router.post(
  '/reset-password',
  resetPasswordValidators,
  checkValidatorResult,
  async (req: Request<{}, {}, ResetPasswordPostData>, res: Response) => {
    const postData: ResetPasswordPostData = req.body;

    await resetPassword(
      req.session.email as string,
      postData.oldPassword,
      postData.newPassword
    );

    return res.json({message: 'Update successful'});
  }
);

router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => {
    console.log('session destroyed');
  });
  res.json({message: 'Logout successful'});
});

export default router;
