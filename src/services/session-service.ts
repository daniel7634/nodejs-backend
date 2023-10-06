import {Request} from 'express';
import {updateUserLastSession} from '../repo/user-repo';

export function getEmailFromSession(req: Request): string | undefined {
  return req.session.email;
}

export async function setEmailToSession(req: Request, email: string) {
  req.session.email = email;
}
