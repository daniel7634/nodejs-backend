import {body, query} from 'express-validator';
import {maxLength, strongPassword, trimNotEmpty} from './common_validator';

export const registerValidators = [
  trimNotEmpty('email', 'Email address is required'),
  maxLength('email', 50, 'Email must not exceed 50 characters'),
  body('email').isEmail().withMessage('Not a valid email address'),
  trimNotEmpty('password', 'Password is required'),
  maxLength('password', 30, 'Password must not exceed 30 characters'),
  strongPassword('password', 'Password does not meet the requirements'),
];

export const loginValidators = [
  trimNotEmpty('email', 'Email address is required'),
  trimNotEmpty('password', 'Password is required'),
];

export const acceptDataValidator = () =>
  query('token').trim().notEmpty().withMessage('Token is required');
