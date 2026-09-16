import { Router } from "express";
import { isAuthenticated } from "../../utils/auth/authenticated.middleware";
import { validate } from "../../utils/validation-middleware";
import { RicaricaDto } from "./ricarica.dto";
import { BonificoDto } from "./bonifico.dto";
import { ricarica } from "./ricarica.controller";
import { bonifico } from "./bonifico.controller";

const router = Router();

router.post('/ricarica', isAuthenticated, validate(RicaricaDto, 'body'), ricarica);
router.post('/bonifico', isAuthenticated, validate(BonificoDto, 'body'), bonifico);

export default router;