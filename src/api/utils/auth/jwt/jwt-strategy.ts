import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { contoCorrenteModel } from "../../../registrazione/registrazione.model";

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: "mia_chiave_segreta_molto_lunga_e_complessa_12345",
    },
    async (payload, done) => {
      console.log("JWT STRATEGY: payload", payload);

      try {
        const user = await contoCorrenteModel.findOne({
          contoCorrenteId: payload.contoCorrenteId,
        });

        console.log(
          "JWT STRATEGY: user trovato?",
          !!user,
          "contoCorrenteId cercato:",
          payload.contoCorrenteId
        );

        if (user) {
          console.log("JWT STRATEGY: autenticazione OK");
          done(null, user.toObject());
        } else {
          console.log("JWT STRATEGY: autenticazione FALLITA (utente non trovato)");
          done(null, false, { message: "invalid token" });
        }
      } catch (err) {
        console.error("JWT STRATEGY: errore", err);
        done(err);
      }
    }
  )
);