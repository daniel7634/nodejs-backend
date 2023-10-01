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

export async function createGoogleUserIfNotExist(
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
    update: {},
  });
  return user;
}

export async function getUser(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({where: {email}});
  return user;
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
