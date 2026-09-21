import { Router } from "express";

import { isAuthenticated } from "../utils/auth/authenticated.middleware";

import * as MovimentoContoCorrenteController from "./movimento-conto-corrente.controller";

const router = Router();

router.get(
    "/:id",
    isAuthenticated,
    async (req, res, next) => {
        await MovimentoContoCorrenteController.dettaglioMovimento(
            req,
            res,
            next
        );
    }
);

export default router;