import express, {Request, Response} from 'express';
import {
  profileNameValidator,
  resetPasswordValidators,
} from '../validators/user-validator';
import {checkValidatorResult, verifyUser} from './util';
import {
  getProfile,
  resetPassword,
  updateProfile,
} from '../services/user-service';
import {getEmailFromSession} from '../services/session-service';

const router = express.Router();

router.use(verifyUser);

router.get('/profile', async (req: Request, res: Response) => {
  res.json({data: await getProfile(getEmailFromSession(req) as string)});
});

interface ProfilePostData {
  name: string;
}

router.patch(
  '/profile',
  profileNameValidator(),
  checkValidatorResult,
  async (req: Request<{}, {}, ProfilePostData>, res: Response) => {
    const postData: ProfilePostData = req.body;

    await updateProfile(getEmailFromSession(req) as string, postData.name);

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
