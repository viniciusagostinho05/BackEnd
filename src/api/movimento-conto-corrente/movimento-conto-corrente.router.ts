import { Router } from 'express';
import { isAuthenticated } from '../utils/auth/authenticated.middleware';
import * as MovimentoContoCorrenteController from './movimento-conto-corrente.controller';
import { validate } from '../utils/validation-middleware';
import { IdParams } from '../utils/id-params';
import { DepositoDto, RitiroDto } from './movimento-conto-corrente.dto';

const router = Router();

router.get( 'dettagli/:id', isAuthenticated, validate(IdParams, 'params'));

router.post( '/deposito', isAuthenticated, validate(DepositoDto, 'body'));

router.post( '/ritiro', isAuthenticated, validate(RitiroDto, 'body'));

export default router;