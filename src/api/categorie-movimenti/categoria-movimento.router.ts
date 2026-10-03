import { Router } from 'express';
import { categoriaMovimentoHandler, cercaCategoriaMovimentoHandler, creaCategoriaMovimentoHandler } from './categoria-movimento.controller';
import { validate } from '../utils/validation-middleware';
import { CercaCategoriaMovimentoDto, CreaCategoriaMovimentoDto } from './categoria-movimenti.dto';
import { ValidationError } from 'class-validator';
import { isAuthenticated } from '../utils/auth/authenticated.middleware';

const router = Router();

router.get('/', isAuthenticated,categoriaMovimentoHandler);

router.post( '/creaCategoria', isAuthenticated,validate( CreaCategoriaMovimentoDto, 'body'), creaCategoriaMovimentoHandler);

router.get('/cercaNomeCat', isAuthenticated,cercaCategoriaMovimentoHandler);


export default router;