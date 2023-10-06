import express, {Request, Response} from 'express';
import {verifyUser} from './util';
import {getTotalSignedUp} from '../services/dashboard-service';

const router = express.Router();

router.use(verifyUser);

router.get('/total-signed-up', async (req: Request, res: Response) => {
  const total = await getTotalSignedUp();
  res.json({data: {total}});
});

export default router;
