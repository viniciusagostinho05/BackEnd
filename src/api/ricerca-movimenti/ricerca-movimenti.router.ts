import { RequestHandler, Router } from 'express';
import { ricercaMovimentiHandler } from './ricerca-movimenti.controller';
import { authMiddleware } from '../auth/auth.middleware';
import { isAuthenticated } from '../utils/auth/authenticated.middleware';


export const ricercaMovimentiRouter = Router();

ricercaMovimentiRouter.get( '/', isAuthenticated,authMiddleware as RequestHandler, ricercaMovimentiHandler as RequestHandler );
