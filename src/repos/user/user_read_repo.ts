import {User, PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();

export async function isUserExist(email: string): Promise<boolean> {
  return (await prisma.user.count({where: {email}})) === 1;
}

export async function isUserVerified(email: string): Promise<boolean> {
  return (await prisma.user.count({where: {email, isVerified: true}})) === 1;
}

export async function getUser(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({where: {email}});
  return user;
}

export interface UserProfileSelect {
  name: string | null;
  email: string;
}

export async function getUserProfile(
  email: string
): Promise<UserProfileSelect | null> {
  const user = await prisma.user.findUnique({
    where: {email},
    select: {name: true, email: true},
  });
  return user;
}

export interface UsersSelect {
  email: string;
  createdAt: Date;
  loginCount: number;
  lastSessionAt: Date | null;
}

export async function getUsers(
  skip: number,
  size: number
): Promise<UsersSelect[]> {
  const users = await prisma.user.findMany({
    skip: skip,
    take: size,
    select: {
      email: true,
      createdAt: true,
      loginCount: true,
      lastSessionAt: true,
    },
  });
  return users;
}

export async function getUserCount(): Promise<number> {
  return await prisma.user.count();
}
