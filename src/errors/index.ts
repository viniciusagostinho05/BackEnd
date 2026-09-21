import { validationHandler } from './validation-error';
import { genericErrorHandler } from "./generic";
import { notFoundHandler } from "./not-found.error";
import { userExistsHandler } from "./user-exists.error";
import { alreadyCompletedHandler } from "./already-completed.error";

export const errorHandlers = [validationHandler, notFoundHandler, userExistsHandler, alreadyCompletedHandler, genericErrorHandler];
