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
                        contoCorrenteId: user.contoCorrenteId,
                        email: user.email
                    },
                    "mia_chiave_segreta_molto_lunga_e_complessa_12345",
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

export async function verificaEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const token = String(req.query.token || '');

    if (!token) {
      return res.redirect(
        `${process.env.FRONTEND_URL}/email-verificata?success=0`
      );
    }

    await verificaEmailService.VerificaEmail(token);

    return res.redirect(
      `${process.env.FRONTEND_URL}/email-verificata?success=1`
    );
  } catch (error) {
    console.error('Errore verifica email:', error);

    return res.redirect(
      `${process.env.FRONTEND_URL}/email-verificata?success=0`
    );
  }
}
