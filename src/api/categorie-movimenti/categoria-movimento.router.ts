import { Router } from 'express';
import passport from 'passport';
import { categoriaMovimentoHandler } from './categoria-movimento.controller';

export const categoriaMovimentoRouter = Router();

categoriaMovimentoRouter.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  categoriaMovimentoHandler
);