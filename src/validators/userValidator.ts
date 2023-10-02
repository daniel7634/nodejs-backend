import {body} from 'express-validator';

export const profileNameValidator = () =>
  body('name').trim().notEmpty().withMessage('The name can be empty');
