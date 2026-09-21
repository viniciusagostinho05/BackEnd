import { Router } from 'express';
import passport from 'passport';
import { RicercaMovimentiQueryDto } from './ricerca-movimenti.dto';
import { ricercaMovimentiHandler } from './ricerca-movimenti.controller';
import { validate } from '../../utils/validation-middleware';


export const ricercaMovimentiRouter = Router();

ricercaMovimentiRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  validate(RicercaMovimentiQueryDto, 'query'),
  ricercaMovimentiHandler
);
