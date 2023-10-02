import {body, query} from 'express-validator';

export const registerEmailValidator = () =>
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email address is required')
    .bail()
    .isEmail()
    .withMessage('Not a valid email address');

export const registerPasswordValidator = () =>
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('Password does not meet the requirements');

export const loginEmailValidator = () =>
  body('email').trim().notEmpty().withMessage('Email address is required');

export const loginPasswordValidator = () =>
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password address is required');

export const acceptDataValidator = () =>
  query('token').trim().notEmpty().withMessage('Token is required');
