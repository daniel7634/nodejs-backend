import {getSessionCountByDay} from '../repo/session-repo';
import {getUserCount} from '../repo/user-repo';

export async function getTotalSignedUp(): Promise<number> {
  return await getUserCount();
}

export async function getTotalSessionToday(): Promise<number> {
  return await getSessionCountByDay(1);
}

export async function getAverageSession(day: number): Promise<number> {
  if (day < 1) {
    return 0;
  }
  return parseFloat(((await getSessionCountByDay(day)) / day).toFixed(2));
}
