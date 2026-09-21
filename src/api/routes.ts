import { Router } from "express";
import { ricercaMovimentiRouter } from "./ricerca-movimenti/ricerca-movimenti.router";
import { categoriaMovimentoRouter } from "./categorie-movimeti/categoria-movimento.router";

const router = Router();

router.use('/movimenti', ricercaMovimentiRouter);
router.use('/categorie-movimenti', categoriaMovimentoRouter);

export default router;