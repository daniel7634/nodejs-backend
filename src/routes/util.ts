import {Request, Response, NextFunction} from 'express';
import {getValidateErrorMsg} from '../validators/util';

export function checkValidatorResult(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const validateErrorMsg = getValidateErrorMsg(req);
  if (validateErrorMsg) {
    res.status(400).json({msg: validateErrorMsg});
  } else {
    next();
  }
}
