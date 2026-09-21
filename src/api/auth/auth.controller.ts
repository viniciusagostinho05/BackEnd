import { NextFunction, Response, Request } from "express";
import { TypedRequest } from "../utils/typed-request";
import { UserExistsError } from "../../errors/user-exist.error";
import { omit, pick } from "lodash";
import registerSrv from '../registrazione/registrazione.service';
import passport from "passport";
import * as jwt from 'jsonwebtoken';
import { ContoCorrenteDto } from "./auth.dto";

export const register = async (req: TypedRequest<ContoCorrenteDto>, res: Response, next: NextFunction) => {
    try{
        const contoCorrente = req.body;
        const credentials = pick(req.body, 'email', 'password');

        const newUser = await registerSrv.add(contoCorrente, credentials);
        res.status(201).json(newUser);
    }catch(err) {
        if (err instanceof UserExistsError) {
        res.status(400);
        res.json({
          error: err.name,
          message: err.message
        });
      } else {
        next(err);
      }
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
      try {
        passport.authenticate('local',
          { session: false },
          (loginErr, user, info) => {

            if (loginErr) {
              next(loginErr);
              return;
            }

            if (!user) {
              res.status(400);
              res.json({
                error: 'LoginError',
                message: info.message
              });
              return;
            }

            // generare token
            const token = jwt.sign(user, 'my_jwt_secret', { expiresIn: '7 days' })
            res.json({
              user,
              token
            });
          }
        )(req, res, next);
      } catch(err) {
        next(err);
      }
  }
