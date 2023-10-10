import {User, PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();

export async function updateUserVerified(token: string): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      registration: {
        token,
      },
    },
    select: {
      email: true,
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
