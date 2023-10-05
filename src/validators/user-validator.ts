import {Meta, body} from 'express-validator';

export const profileNameValidator = () =>
  body('name')
    .trim()
    .notEmpty()
    .withMessage('The name can be empty')
    .isLength({max: 30})
    .withMessage('The name must not exceed 30 characters');

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
    .withMessage('Password is required')
    .bail()
    .isLength({max: 30})
    .withMessage('Password must not exceed 30 characters')
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('Password does not meet the requirements'),
  body('newPassword')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({max: 30})
    .withMessage('Password must not exceed 30 characters')
    .bail()
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage('Password does not meet the requirements')
    .custom(checkPasswordChange)
    .withMessage('The new password must be different'),
];
