import { Router } from "express";
import { validate } from "../utils/validation-middleware";
import { getUser } from "./conto-corrente.controller";
import { isAuthenticated } from "../utils/auth/authenticated.middleware";

const router = Router();

// router.get("/home", home);

router.get("/user", isAuthenticated, getUser);

export default router;