import {Request, Response, NextFunction} from 'express';
import {getValidateErrorMsg} from '../validators/util';
import {RouteError} from '../error';
import {StatusCodes} from 'http-status-codes';
import {isUserVerified} from '../repo/user-repo';

export function checkValidatorResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validateErrorMsg = getValidateErrorMsg(req);
  if (validateErrorMsg) {
    throw new RouteError(StatusCodes.BAD_REQUEST, validateErrorMsg);
  } else {
    next();
  }
}

export async function verifyUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.session.email && (await isUserVerified(req.session.email))) {
    next();
  } else {
    throw new RouteError(StatusCodes.UNAUTHORIZED, 'User is not verified');
  }
}
