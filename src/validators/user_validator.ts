import {Meta, body} from 'express-validator';
import {maxLength, strongPassword, trimNotEmpty} from './common_validator';

export const patchProfileValidators = [
  trimNotEmpty('name', 'The name can be empty'),
  maxLength('name', 30, 'The name must not exceed 30 characters'),
];

const checkPasswordChange = (newPassword: string, meta: Meta): boolean => {
  const {oldPassword} = meta.req.body;
  if (oldPassword !== newPassword) {
    return true;
  }
  return false;
};

export const resetPasswordValidators = [
  trimNotEmpty('oldPassword', 'Old password is required'),
  maxLength('oldPassword', 30, 'Old password must not exceed 30 characters'),
  strongPassword('oldPassword', 'old password does not meet the requirements'),
  trimNotEmpty('newPassword', 'New password is required'),
  maxLength('newPassword', 30, 'New password must not exceed 30 characters'),
  strongPassword('newPassword', 'New password does not meet the requirements'),
  body('newPassword')
    .custom(checkPasswordChange)
    .withMessage('New password must be different'),
];
