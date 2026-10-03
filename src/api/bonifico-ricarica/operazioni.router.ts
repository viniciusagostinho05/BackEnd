import { Router } from "express";
import { RicaricaDto } from "./ricarica.dto";
import { BonificoDto } from "./bonifico.dto";
import { ricarica } from "./ricarica.controller";
import { bonifico } from "./bonifico.controller";
import { validate } from "../utils/validation-middleware";
import { isAuthenticated } from "../utils/auth/authenticated.middleware";
import { DepositoDto } from "./deposito.dto";
import { deposito } from "./deposito.controller";

const router = Router();

router.post('/ricarica',  isAuthenticated,validate(RicaricaDto, 'body'), ricarica);
router.post('/bonifico', isAuthenticated,validate(BonificoDto, 'body'), bonifico);
router.post('/deposito', isAuthenticated, validate(DepositoDto, 'body'), deposito);

export default router;