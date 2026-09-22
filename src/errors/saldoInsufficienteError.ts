import { NextFunction, Request, Response } from "express";

// Errori di business come saldo insufficiente, IBAN non trovato, ecc.
export class SaldoInsufficienteError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'BusinessError';
    this.status = status;
  }
}

export const SaldoInsufficienteErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SaldoInsufficienteError) {
    res.status(err.status).json({
      error: err.name,
      message: err.message
    });
  } else {
    next(err);
  }
}