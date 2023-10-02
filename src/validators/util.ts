import {Request} from 'express';
import {validationResult} from 'express-validator';

export function getValidateErrorMsg(req: Request): string {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return result.array()[0].msg; // now only return the first error message immediately
  }
  return '';
}
