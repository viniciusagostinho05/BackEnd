import { Router } from 'express';
import { isAuthenticated } from '../utils/auth/authenticated.middleware';
import { validate } from '../utils/validation-middleware';
import { IdParams } from '../utils/id-params';
import { DepositoDto, RitiroDto } from './movimento-conto-corrente.dto';
import { deposito, dettaglioMovimento, ritiro } from './movimento-conto-corrente.controller';

const router = Router();

router.get( 'dettagli/:id', isAuthenticated, validate(IdParams, 'params'), dettaglioMovimento);

router.post( '/deposito',  validate(DepositoDto, 'body'), deposito);

router.post( '/ritiro', isAuthenticated, validate(RitiroDto, 'body'), ritiro);

export default router;