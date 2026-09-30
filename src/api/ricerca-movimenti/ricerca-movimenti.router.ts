import { RequestHandler, Router } from 'express';
import { ricercaMovimentiHandler } from './ricerca-movimenti.controller';
import { authMiddleware } from '../auth/auth.middleware';


export const ricercaMovimentiRouter = Router();

ricercaMovimentiRouter.get( '/', authMiddleware as RequestHandler, ricercaMovimentiHandler as RequestHandler );
