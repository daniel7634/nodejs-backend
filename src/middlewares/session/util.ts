import {Request} from 'express';
import {updateUserLastSession} from '../../repo/user_repo';

declare module 'express-session' {
  // type for req.session
  interface SessionData {
    email: string;
  }
}

export function getEmailFromSession(req: Request): string | undefined {
  return req.session.email;
}
export async function setEmailToSession(req: Request, email: string) {
  req.session.email = email;
  await updateUserLastSession(email);
}
