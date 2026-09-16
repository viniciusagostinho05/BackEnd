import { NextFunction, Request, Response } from "express";
import { Role } from "../user.role.auth";
import { User } from "../../api/user/user.entity";

export const requireRole = (role: Role) =>
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User;

    if (!user || user.role !== role) {
      res.status(404);
      res.json({ error: 'NotFoundError', message: 'Risorsa non trovata' });
      return;
    }
    next();
  };