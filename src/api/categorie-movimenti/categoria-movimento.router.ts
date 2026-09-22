import { Router } from 'express';
import { categoriaMovimentoHandler, creaCategoriaMovimentoHandler } from './categoria-movimento.controller';
import { validate } from '../utils/validation-middleware';
import { CreaCategoriaMovimentoDto } from './categoria-movimenti.dto';

const router = Router();

router.get('/', categoriaMovimentoHandler);

router.post( '/creaCategoria', validate( CreaCategoriaMovimentoDto, 'body'), creaCategoriaMovimentoHandler);

export default router;