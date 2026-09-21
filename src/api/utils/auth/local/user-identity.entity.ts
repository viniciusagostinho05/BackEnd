import { Types } from "mongoose";
import { User } from "../../../registrazione/registrazione.entity";

export type UserIdentity = {
  contoCorrenteId: Types.ObjectId;
  provider: string,
  credentials: {
    email: string;
    hashedPassword: string;
  };
  user: User;
}
