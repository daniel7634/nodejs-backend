import {StatusCodes} from 'http-status-codes';
import bcrypt from 'bcrypt';

import {RouteError} from '../error';
import {
  UserProfileSelect,
  getUser,
  getUserProfile,
  updateUserName,
  updateUserPassword,
} from '../repo/user-repo';

export async function getProfile(email: string): Promise<UserProfileSelect> {
  const user = await getUserProfile(email);
  if (!user) {
    throw new RouteError(StatusCodes.BAD_REQUEST, 'User is not exist');
  } else {
    return user;
  }
}

export async function updateProfile(email: string, name: string) {
  try {
    await updateUserName(email, name);
  } catch (error) {
    console.error(error);
    throw new RouteError(StatusCodes.BAD_REQUEST, 'Update failed');
  }
}

export async function resetPassword(
  email: string,
  oldPassword: string,
  newPassword: string
) {
  const user = await getUser(email);
  if (!user || !user.password) {
    throw new RouteError(StatusCodes.BAD_REQUEST, 'Invalid email or password');
  }

  const passwordMatch = await bcrypt.compare(oldPassword, user.password);
  if (!passwordMatch) {
    throw new RouteError(StatusCodes.BAD_REQUEST, 'Invalid email or password');
  }

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await updateUserPassword(email, hashedPassword);
}
