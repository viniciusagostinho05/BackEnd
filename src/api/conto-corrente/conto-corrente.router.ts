import { Router } from "express";
import { isAuthenticated } from "../utils/auth/authenticated.middleware";
import * as ContoCorrenteController from "./conto-corrente.controller";

const router = Router();

router.get(
    "/home",
    isAuthenticated,
    async (req, res, next) => {
        await ContoCorrenteController.home(req, res, next);
    }
);

export default router;