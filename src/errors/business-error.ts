import { NextFunction, Request, Response } from "express";

// Errori di business come saldo insufficiente, IBAN non trovato, ecc.
export class BusinessError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'BusinessError';
    this.status = status;
  }
}

export const businessErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BusinessError) {
    res.status(err.status).json({
      error: err.name,
      message: err.message
    });
  } else {
    next(err);
  }
}