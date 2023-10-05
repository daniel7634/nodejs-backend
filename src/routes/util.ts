import {Request, Response, NextFunction} from 'express';
import {getValidateErrorMsg} from '../validators/util';
import {RouteError} from '../error';
import {StatusCodes} from 'http-status-codes';

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
