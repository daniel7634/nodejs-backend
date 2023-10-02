import {Meta, body} from 'express-validator';

export const profileNameValidator = () =>
  body('name').trim().notEmpty().withMessage('The name can be empty');

const checkPasswordChange = (newPassword: string, meta: Meta): boolean => {
  const {oldPassword} = meta.req.body;
  if (oldPassword !== newPassword) {
    return true;
  }
  return false;
};

export const resetPasswordValidators = [
  body('oldPassword')
    .trim()
    .notEmpty()
    .withMessage('The old password is required')
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('The old password does not meet the requirements'),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('The new password is required')
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('The new password does not meet the requirements')
    .custom(checkPasswordChange)
    .withMessage('The new password must be different'),
];
