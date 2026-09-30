import { Router } from 'express';
import { categoriaMovimentoHandler, cercaCategoriaMovimentoHandler, creaCategoriaMovimentoHandler } from './categoria-movimento.controller';
import { validate } from '../utils/validation-middleware';
import { CercaCategoriaMovimentoDto, CreaCategoriaMovimentoDto } from './categoria-movimenti.dto';
import { ValidationError } from 'class-validator';

const router = Router();

router.get('/', categoriaMovimentoHandler);

router.post( '/creaCategoria', validate( CreaCategoriaMovimentoDto, 'body'), creaCategoriaMovimentoHandler);

router.get('/cercaNomeCat', cercaCategoriaMovimentoHandler);


export default router;