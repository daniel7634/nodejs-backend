import {Request, Response} from 'express';

import {
  getAverageSession,
  getTotalSessionToday,
  getTotalSignedUp,
  getUsersPagination,
} from '../services/dashboard_service';

export async function totalSignedUpHandler(req: Request, res: Response) {
  const total = await getTotalSignedUp();
  res.json({data: {total}});
}

export async function totalSessionTodayHandler(req: Request, res: Response) {
  const total = await getTotalSessionToday();
  res.json({data: {total}});
}

interface AverageSessionParams {
  day?: number;
}

export async function averageSessionHandler(req: Request, res: Response) {
  let total = 0;
  const {day} = req.query as AverageSessionParams;
  if (day) {
    total = await getAverageSession(day);
  }
  res.json({data: {total}});
}

interface UsersQuery {
  page?: number;
}

export async function usersPaginationHandler(req: Request, res: Response) {
  const {page} = req.query as UsersQuery;
  res.json({
    data: await getUsersPagination(page || 1),
  });
}
