import {User, PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();

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
