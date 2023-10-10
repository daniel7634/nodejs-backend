import {PrismaClient} from '@prisma/client';

export const prisma = new PrismaClient();

export async function getRegistrationToken(
  email: string
): Promise<string | null> {
  const registration = await prisma.userRegistration.findFirst({
    where: {
      user: {email},
    },
    select: {
      token: true,
    },
  });
  return registration ? registration.token : null;
}
