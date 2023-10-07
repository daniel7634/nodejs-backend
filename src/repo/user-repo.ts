import {PrismaClient, User} from '@prisma/client';

const prisma = new PrismaClient();

export async function createUserWithToken(
  email: string,
  password: string,
  token: string
): Promise<User> {
  const user = await prisma.user.create({
    data: {
      email,
      password,
      registration: {
        create: {
          token,
        },
      },
    },
  });
  return user;
}

export async function createVerifiedUser(
  name: string,
  email: string
): Promise<User> {
  const user = await prisma.user.upsert({
    where: {email},
    create: {
      name,
      email,
      isVerified: true,
    },
    update: {
      isVerified: true,
    },
  });
  return user;
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

export async function isUserVerified(email: string): Promise<boolean> {
  return (await prisma.user.count({where: {email, isVerified: true}})) === 1;
}

export async function getRegistrationToken(
  email: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      registration: true,
    },
  });
  if (user && user.registration) {
    return user.registration.token;
  }
  return null;
}

export async function acceptRegistration(token: string): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      registration: {
        token,
      },
    },
    select: {
      email: true,
      registration: true,
    },
  });
  if (user) {
    return await prisma.user.update({
      where: {email: user.email},
      data: {
        isVerified: true,
        registration: {
          delete: true,
        },
      },
    });
  } else {
    return null;
  }
}

export async function updateUserName(
  email: string,
  name: string
): Promise<User | null> {
  const user = await prisma.user.update({
    where: {email},
    data: {name},
  });
  return user;
}

export async function updateUserPassword(
  email: string,
  password: string
): Promise<User | null> {
  const user = await prisma.user.update({
    where: {email},
    data: {password},
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

export async function increaseUserLoginCount(email: string) {
  await prisma.user.update({
    where: {email},
    data: {loginCount: {increment: 1}},
  });
}

export async function updateUserLastSession(email: string) {
  await prisma.user.update({
    where: {email},
    data: {lastSessionAt: new Date()},
  });
}
