import { NextFunction, Request, Response } from 'express';

export class AlreadyCompletedError extends Error {
  constructor() {
    super();
    this.message = "L'attività è già stata completata";
    this.name = 'AlreadyCompleted';
  }
}

export const alreadyCompletedHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AlreadyCompletedError) {
    res.status(400);
    res.json({
      error: err.name,
      message: err.message
    });
  } else {
    next(err);
  }
}