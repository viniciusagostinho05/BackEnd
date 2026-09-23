import { Router } from "express";
import authRouter from './auth/auth.router';
import { ricercaMovimentiRouter } from "./ricerca-movimenti/ricerca-movimenti.router";
import operazioniRouter from "../api/bonifico-ricarica/operazioni.router";
import CategoriaMovimentoRouter from "./categorie-movimenti/categoria-movimento.router";
import modificaPasswordRouter from "./modifica-password/modifica-password.router";
const router = Router();

router.use("/modifica-password", modificaPasswordRouter);
router.use('/categoria', CategoriaMovimentoRouter);
router.use('/operazioni', operazioniRouter);
router.use('/movimenti', ricercaMovimentiRouter);
router.use(authRouter);

export default router;