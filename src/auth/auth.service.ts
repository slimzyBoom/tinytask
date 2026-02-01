import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import { TokenPayload } from "../common/interfaces/user"
const ACCESS_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
const REFRESH_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;
const TEMP_SECRET = process.env.TEMP_TOKEN as string;


export const generate_tokens = (payload: TokenPayload) => {
  const access_token = jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15m"
  });
  const refresh_token = jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d",
  });
  return { access_token, refresh_token };
};
export const validate_access_token = (token: string ): TokenPayload | null => {
  try {
    return jwt.verify(token, ACCESS_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}
export const validate_refresh_token = (token: string ): TokenPayload | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

export const generate_temp_token = (email: string) => {
  try {
    return jwt.sign({ email }, TEMP_SECRET, { expiresIn: "10m" });
  } catch (error) {
    return null;
  }
}

export const validate_temp_token = (token: string ): { email: string } | null => {
  try {
    return jwt.verify(token, TEMP_SECRET) as { email: string };
  } catch (error) {
    return null;
  }
}
export const hash_token = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
}

export const comparePassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
}
