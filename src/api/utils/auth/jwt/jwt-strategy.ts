console.log("JWT STRATEGY CARICATA");

import passport from "passport";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { contoCorrenteModel } from "../../../registrazione/registrazione.model";

passport.use(new JwtStrategy({

    jwtFromRequest: (req) => {
        console.log("HEADER:", req.headers.authorization);

        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    },

    secretOrKey: 'my_jwt_secret'

},
async (payload, done) => {

    console.log("PAYLOAD:", payload);

    try {
        const user = await contoCorrenteModel.findOne({
    email: payload.email
});

        if (user) {
            done(null, user.toObject());
        } else {
            done(null, false, { message: 'invalid token' });
        }

    } catch(err) {
        done(err);
    }
}));