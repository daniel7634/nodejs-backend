import {v4 as uuidv4} from 'uuid';
import bcrypt from 'bcrypt';
import {StatusCodes} from 'http-status-codes';
import {User} from '@prisma/client';

import {createUserWithToken, getUser} from '../repo/user-repo';
import {sendVerificationEmail} from '../emailer';
import {RouteError} from '../error';

export async function registerUser(email: string, password: string) {
  const user = await getUser(email);
  if (user) {
    throw new RouteError(StatusCodes.BAD_REQUEST, 'Email already exists');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const token = uuidv4();
  await createUserWithToken(email, hashedPassword, token);
  sendVerificationEmail(email, token);
}

export async function loginUser(
  email: string,
  password: string
): Promise<User> {
  const user = await getUser(email);
  if (!user || !user.password) {
    throw new RouteError(StatusCodes.BAD_REQUEST, 'Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new RouteError(StatusCodes.BAD_REQUEST, 'Invalid email or password');
  }

  return user;
}
