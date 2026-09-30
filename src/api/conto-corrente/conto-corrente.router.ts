import { Router } from "express";
import { validate } from "../utils/validation-middleware";
import { getUser } from "./conto-corrente.controller";

const router = Router();

// router.get("/home", home);

router.get("/user", getUser);

export default router;