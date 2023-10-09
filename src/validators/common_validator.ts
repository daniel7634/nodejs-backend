import {ValidationChain, body} from 'express-validator';

export const trimNotEmpty = (field: string, message: string): ValidationChain =>
  body(field).trim().notEmpty().withMessage(message).bail();

export const maxLength = (
  field: string,
  length: number,
  message: string
): ValidationChain =>
  body(field).isLength({max: length}).withMessage(message).bail();

export const strongPassword = (
  field: string,
  message: string
): ValidationChain =>
  body(field)
    .isStrongPassword(PASSWORD_STRENGTH_OPTIONS)
    .withMessage(message)
    .bail();

const PASSWORD_STRENGTH_OPTIONS = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
};
