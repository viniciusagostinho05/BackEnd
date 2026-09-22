import crypto from 'node:crypto';
import { NextFunction, Response, Request } from "express";
import { TypedRequest } from "../utils/typed-request";
import { UserExistsError } from "../../errors/user-exist.error";
import { pick } from "lodash";
import registerSrv from '../registrazione/registrazione.service';
import passport from "passport";
import * as jwt from 'jsonwebtoken';
import { ContoCorrenteDto } from "./auth.dto";
import accessoService from "../accesso/accesso.service";
import { VerificaEmailModel } from "../registrazione/verfica-email.model";
import verificaEmailService from '../registrazione/verifica-email.service';

export const register = async (
  req: TypedRequest<ContoCorrenteDto>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contoCorrente = req.body;

    const credentials = pick(
      req.body,
      'email',
      'password'
    );

    const newUser = await registerSrv.add(
      contoCorrente,
      credentials
    );

    const token = crypto
      .randomBytes(32)
      .toString('hex');

    await VerificaEmailModel.create({
      contoCorrenteId: newUser.contoCorrenteId,
      token,
    });

    await verificaEmailService.sendVerificationEmail(
      newUser.email,
      token
    );

    res.status(201).json({
      message:
        'Registrazione completata. Controlla la tua email per verificare l’account.',
    });
  } catch (err) {
    if (err instanceof UserExistsError) {
      res.status(400).json({
        error: err.name,
        message: err.message,
      });

      return;
    }

    next(err);
  }
};

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try { passport.authenticate( "local", { session: false }, async (loginErr: any, user: any, info: any) => {
                if (loginErr) {
                    return next(loginErr);
                }
                const ip =
                    req.ip ||
                    req.socket.remoteAddress ||
                    "Sconosciuto";

                if (!user) {
                    await accessoService.registraAccesso(
                        ip,
                        false
                    );

                    return res.status(401).json({
                        error: "LoginError",
                        message: info?.message || "Email o password non validi."
                    });
                }

                await accessoService.registraAccesso(
                    ip,
                    true
                );

                const token = jwt.sign(
                    {
                        contoCorrenteID: user.contoCorrenteID,
                        email: user.email
                    },
                    "my_jwt_secret",
                    {
                        expiresIn: "7d"
                    }
                );

                return res.json({
                    user,
                    token
                });
            }

        )(req, res, next);

    } catch (err) {
        next(err);
    }

};

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      res.status(400).json({
        message: 'Token mancante o non valido',
      });

      return;
    }

    const message =
      await verificaEmailService.VerificaEmail( token );

    res.status(200).json({
      message,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message ===
        'Token non valido o scaduto'
    ) {
      res.status(400).json({
        message: error.message,
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        'Conto corrente non trovato'
    ) {
      res.status(404).json({
        message: error.message,
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message ===
        'Categoria apertura conto non trovata'
    ) {
      res.status(500).json({
        message: error.message,
      });

      return;
    }

    next(error);
  }
}