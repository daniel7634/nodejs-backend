import express, {Request, Response, NextFunction} from 'express';
import {isUserVerified, updateUserName} from '../repo';
import {profileNameValidator} from '../validators/userValidator';
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

export default router;
