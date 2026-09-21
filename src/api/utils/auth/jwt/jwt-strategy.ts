import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { ContoCorrenteModel } from "../../../conto-corrente/conto-corrente.model";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "my_jwt_secret"
    },
    async (payload, done) => {
      try {

        const conto = await ContoCorrenteModel.findOne({
          ContoCorrenteID: payload.ContoCorrenteID
        });

        if (!conto) {
          return done(null, false, {
            message: "Token non valido"
          });
        }

        return done(null, conto);

      } catch (err) {
        return done(err);
      }
    }
  )
);