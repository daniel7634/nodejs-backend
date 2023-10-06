import express, {Request, Response} from 'express';
import {verifyUser} from './util';
import {
  getAverageSession,
  getTotalSessionToday,
  getTotalSignedUp,
} from '../services/dashboard-service';

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

router.get(
  '/average-session',
  async (req: Request<{}, {}, {}, AverageSessionParams>, res: Response) => {
    let total = 0;
    if (req.query.day) {
      total = await getAverageSession(req.query.day);
    }
    res.json({data: {total}});
  }
);

export default router;
