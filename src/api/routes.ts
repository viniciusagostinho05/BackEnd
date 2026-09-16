import { Router } from "express";
import operazioniRouter from './operazioni/operazioni.router';

const router = Router();
router.use('/operazioni', operazioniRouter);

export default router;