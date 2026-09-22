import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { contoCorrenteModel } from "../../../registrazione/registrazione.model";

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'my_jwt_secret'
  },
  async (payload, done) => {
    try {
      const user = await contoCorrenteModel.findById(payload.id);
      if (user) {
        done(null, user.toObject());
      } else {
        done(null, false, { message: 'invalid token' });
      }
    } catch(err) {
      done(err);
    }
  })
)
