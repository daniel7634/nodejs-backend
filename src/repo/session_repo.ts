import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

function getStartAndEndDates(daysAgo = 1): [Date, Date] {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const start = new Date(today);
  start.setDate(start.getDate() - (daysAgo - 1));

  const end = new Date(today);
  end.setDate(end.getDate() + 1);

  return [start, end];
}

export async function getSessionCountDaysAgo(daysAgo: number): Promise<number> {
  if (daysAgo < 1) {
    return 0;
  }

  const [startDate, endDate] = getStartAndEndDates(daysAgo);

  const count = await prisma.session.count({
    where: {
      updatedAt: {
        gte: startDate,
        lt: endDate,
      },
    },
  });
  return count;
}
