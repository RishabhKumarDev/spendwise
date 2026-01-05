import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { Env } from "../config/env.config";

export type AccessTokenPayload = {
  userId: string;
};

const accessTokenOptions: SignOptions = {
  expiresIn: Env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  audience: "user",
};

export const signJwtToken = (payload: AccessTokenPayload) => {
  const secret = Env.JWT_SECRET;

  const token = jwt.sign(payload, secret, accessTokenOptions);

  const decoded = jwt.decode(token) as JwtPayload | null;

  return {
    token,
    expiresAt: decoded?.exp ? decoded.exp * 1000 : undefined,
  };
};
