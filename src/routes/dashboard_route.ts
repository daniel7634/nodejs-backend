import express, {Request, Response} from 'express';
import {verifyUser} from './util';
import {
  getAverageSession,
  getTotalSessionToday,
  getTotalSignedUp,
  getUsersPagination,
} from '../services/dashboard_service';

const router = express.Router();

router.use(verifyUser);

router.get('/total-signed-up', async (req: Request, res: Response) => {
  const total = await getTotalSignedUp();
  res.json({data: {total}});
});

router.get('/total-session-today', async (req: Request, res: Response) => {
  const total = await getTotalSessionToday();
  res.json({data: {total}});
});

interface AverageSessionParams {
  day?: number;
}

router.get('/average-session', async (req: Request, res: Response) => {
  let total = 0;
  const {day} = req.query as AverageSessionParams;
  if (day) {
    total = await getAverageSession(day);
  }
  res.json({data: {total}});
});

interface UsersQuery {
  page?: number;
}

router.get('/users', async (req, res) => {
  const {page} = req.query as UsersQuery;
  res.json({
    data: await getUsersPagination(page || 1),
  });
});

export default router;
