import express from 'express';
import {verifyUser} from './util';
import {
  averageSessionHandler,
  totalSessionTodayHandler,
  totalSignedUpHandler,
  usersPaginationHandler,
} from '../controllers/dashboard_controller';

const router = express.Router();

router.use(verifyUser);

router.get('/total-signed-up', totalSignedUpHandler);
router.get('/total-session-today', totalSessionTodayHandler);
router.get('/average-session', averageSessionHandler);
router.get('/users', usersPaginationHandler);

export default router;
