import express from 'express';
import {verifyUser} from './util';
import {
  averageSessionHandler,
  totalSessionTodayHandler,
  totalSignedUpHandler,
  usersPaginationHandler,
} from '../controllers/dashboard_controller';

export const dashboardRouter = express.Router();

dashboardRouter.use(verifyUser);

dashboardRouter.get('/total-signed-up', totalSignedUpHandler);
dashboardRouter.get('/total-session-today', totalSessionTodayHandler);
dashboardRouter.get('/average-session', averageSessionHandler);
dashboardRouter.get('/users', usersPaginationHandler);
