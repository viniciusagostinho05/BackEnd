import { Router } from "express";

import authRouter from "./auth/auth.router";
import contoCorrenteRouter from "./conto-corrente/conto-corrente.router";
import movimentoRouter from "./movimento-conto-corrente/movimento-conto-corrente.router";

const router = Router();

router.use(authRouter);

router.use("/conto-corrente", contoCorrenteRouter);

router.use("/movimento", movimentoRouter);

export default router;