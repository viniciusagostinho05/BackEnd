import { NextFunction, Request, Response } from "express";
import passport from "passport";
import * as jwt from "jsonwebtoken";

import { TypedRequest } from "../utils/typed-request";
import { RegisterDto } from "./auth.dto";
import accessoService from "../accesso/accesso.service";


export const register = async (
    req: TypedRequest<RegisterDto>,
    res: Response,
    next: NextFunction
) => {
    try {

        // TODO: adattare la registrazione al nuovo database

        res.status(501).json({
            message: "Registrazione non ancora implementata."
        });

    } catch (err) {
        next(err);
    }
};


export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    try {

        passport.authenticate(
            "local",
            { session: false },
            async (loginErr: any, user: any, info: any) => {

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
                        ContoCorrenteID: user.ContoCorrenteID,
                        Email: user.Email
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