import { Types } from "mongoose";
import { ContoCorrente } from "../../../registrazione/registrazione.entity";

export type UserIdentity = {
  contoCorrenteId: Types.ObjectId;
  provider: string,
  credentials: {
    email: string;
    hashedPassword: string;
  };
  user: ContoCorrente;
}
