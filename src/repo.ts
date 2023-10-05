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
