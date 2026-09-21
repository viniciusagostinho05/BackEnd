import { validationHandler } from './validation-error';
import { businessErrorHandler } from './business-error';
import { notFoundHandler } from './not-found.error';
import { genericErrorHandler } from './generic';

export const errorHandlers = [
  validationHandler,
  businessErrorHandler,
  notFoundHandler,
  genericErrorHandler
];
