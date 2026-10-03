import { Router } from "express";
import { validate } from "../utils/validation-middleware";
import { isAuthenticated } from "../utils/auth/authenticated.middleware";

import { ModificaPasswordDto } from "./modifica-password.dto";
import { modificaPassword } from "./modifica-password.controller";

const router = Router();

router.put( "/", isAuthenticated, validate(ModificaPasswordDto, "body"), modificaPassword);

export default router;