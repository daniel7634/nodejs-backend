import express, {Request, Response, NextFunction} from 'express';
import bcrypt from 'bcrypt';
import {
  getUser,
  isUserVerified,
  updateUserName,
  updateUserPassword,
} from '../repo';
import {
  profileNameValidator,
  resetPasswordValidators,
} from '../validators/userValidator';
import {checkValidatorResult} from './util';

const router = express.Router();

router.use(verifyUser);

async function verifyUser(req: Request, res: Response, next: NextFunction) {
  if (req.session.email && (await isUserVerified(req.session.email))) {
    next();
  } else {
    res.status(401).json({message: 'User is not verified'});
  }
}

interface ProfilePostData {
  name: string;
}

router.post(
  '/profile',
  profileNameValidator(),
  checkValidatorResult,
  async (res: Request<{}, {}, ProfilePostData>, rep: Response) => {
    try {
      const postData: ProfilePostData = res.body;
      await updateUserName(res.session.email as string, postData.name);
      rep.json({message: 'Update successful'});
    } catch (error) {
      console.error(error);
      rep.status(400).json({message: 'Update failed'});
    }
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
    try {
      const postData: ResetPasswordPostData = req.body;

      const user = await getUser(req.session.email as string);
      if (!user || !user.password) {
        return res.status(401).json({message: 'Invalid email or password'});
      }

      const passwordMatch = await bcrypt.compare(
        postData.oldPassword,
        user.password
      );
      if (!passwordMatch) {
        return res.status(401).json({message: 'Invalid email or password'});
      }

      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(
        postData.newPassword,
        saltRounds
      );

      await updateUserPassword(req.session.email as string, hashedPassword);
      return res.json({message: 'Update successful'});
    } catch (error) {
      console.error(error);
      return res.status(400).json({message: 'Update failed'});
    }
  }
);

export default router;
