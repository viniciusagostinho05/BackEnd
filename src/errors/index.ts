import { genericErrorHandler } from "./generic.error";
import { notFoundHandler } from "./not-found.error";
import { validationHandler } from "./validation.error";

export const errorHandlers = [genericErrorHandler, validationHandler, notFoundHandler];