import {Request, Response} from 'express';

import {
  getProfile,
  resetPassword,
  updateProfile,
} from '../services/user_service';
import {getEmailFromSession} from '../middlewares/session/util';

export async function getProfileHandler(req: Request, res: Response) {
  res.json({data: await getProfile(getEmailFromSession(req) as string)});
}

interface ProfilePostData {
  name: string;
}

export async function patchProfileHandler(req: Request, res: Response) {
  const postData: ProfilePostData = req.body as ProfilePostData;

  await updateProfile(getEmailFromSession(req) as string, postData.name);

  res.json({message: 'Update successful'});
}

interface ResetPasswordPostData {
  oldPassword: string;
  newPassword: string;
}

export async function resetPasswordHandler(req: Request, res: Response) {
  const postData: ResetPasswordPostData = req.body as ResetPasswordPostData;

  await resetPassword(
    req.session.email as string,
    postData.oldPassword,
    postData.newPassword
  );

  return res.json({message: 'Update successful'});
}

export function logoutHandler(req: Request, res: Response) {
  req.session.destroy(() => {
    console.log('session destroyed');
  });
  res.json({message: 'Logout successful'});
}
