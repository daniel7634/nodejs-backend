import {Request, Response} from 'express';
import GoogleStrategy from 'passport-google-oauth20';
import {StatusCodes} from 'http-status-codes';

import {
  getEmailFromSession,
  setEmailToSession,
} from '../middlewares/session/util';
import {
  updateUserVerified,
  increaseUserLoginCount,
} from '../repos/user/user_update_repo';
import {loginUser, registerUser} from '../services/auth_service';
import {sendVerificationEmail} from '../emailer';
import {getRegistrationToken} from '../repos/user_registration_repo';

export async function googleCallbackHandler(req: Request, res: Response) {
  const user = req.user as GoogleStrategy.Profile;
  if (user.emails && user.emails[0].value) {
    const email: string = user.emails[0].value;
    await setEmailToSession(req, email);
    await increaseUserLoginCount(email);
  }
  res.redirect('/');
}

interface RegisterPostData {
  email: string;
  password: string;
}

export async function registerHandler(req: Request, res: Response) {
  const postData: RegisterPostData = req.body as RegisterPostData;

  await registerUser(postData.email, postData.password);
  await setEmailToSession(req, postData.email);

  return res.status(StatusCodes.CREATED).json({message: 'Register successful'});
}

interface LoginPostData {
  email: string;
  password: string;
}

export async function loginHandler(req: Request, res: Response) {
  const postData: LoginPostData = req.body as LoginPostData;
  const user = await loginUser(postData.email, postData.password);
  await setEmailToSession(req, postData.email);
  return res.json({data: {isVerified: user.isVerified}});
}

interface AcceptQueryData {
  token?: string;
}

export async function acceptHandler(req: Request, res: Response) {
  const queryData: AcceptQueryData = req.query as AcceptQueryData;
  if (queryData.token) {
    const user = await updateUserVerified(queryData.token);
    if (user) {
      await increaseUserLoginCount(user.email);
      await setEmailToSession(req, user.email);
    }
  }
  return res.redirect('/');
}

export async function resendEmailHandler(req: Request, res: Response) {
  const email = getEmailFromSession(req);
  if (email) {
    const token = await getRegistrationToken(email);
    if (token) {
      sendVerificationEmail(email, token);
      return res.json({message: 'Resend email successful'});
    }
    return res.json({message: 'Email verification has expired'});
  }
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({error: 'Please login first'});
}
