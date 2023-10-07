import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function getTodaySessionCount(): Promise<number> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const count = await prisma.session.count({
    where: {
      updatedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });
  return count;
}

export async function getSessionCountByDay(day: number): Promise<number> {
  if (day < 1) {
    return 0;
  }

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (day - 1));
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const count = await prisma.session.count({
    where: {
      updatedAt: {
        gte: startDate,
        lt: tomorrow,
      },
    },
  });
  return count;
}
