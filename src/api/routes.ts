import { Router } from "express";
import authRouter from './auth/auth.router';
import { ricercaMovimentiRouter } from "./ricerca-movimenti/ricerca-movimenti.router";
import operazioniRouter from "../api/bonifico-ricarica/operazioni.router";
import CategoriaMovimentoRouter from "./categorie-movimenti/categoria-movimento.router";
import ContoCorrenteRouter from './conto-corrente/conto-corrente.router';
import MovimentoContoCorrenteRouter from './movimento-conto-corrente/movimento-conto-corrente.router';
import modificaPasswordRouter from "./modifica-password/modifica-password.router";

const router = Router();

router.use('/categoria', CategoriaMovimentoRouter);
router.use('/operazioni', operazioniRouter);
router.use('/movimenti', ricercaMovimentiRouter);
router.use('/conto-corrente',  ContoCorrenteRouter);
router.use('/movimento-conto', MovimentoContoCorrenteRouter)
router.use("/modifica-password", modificaPasswordRouter);
router.use(authRouter);

export default router;