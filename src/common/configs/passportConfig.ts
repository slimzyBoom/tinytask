import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { AppError } from "../../errors/appError";
import { HttpStatus } from "../enums/http_status_codes";
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLIENT_CALLBACK_DEV = process.env.GOOGLE_CALLBACK_URL_DEV;
const CLIENT_CALLBACK_PROD = process.env.GOOGLE_CALLBACK_URL_PROD;
const isProd = process.env.NODE_ENV === "production";
const clientCallback = isProd ?  CLIENT_CALLBACK_PROD : CLIENT_CALLBACK_DEV;

if (!CLIENT_ID || !CLIENT_SECRET || !clientCallback) {
  throw new AppError("Missing config variables", HttpStatus.ServerError);
}

passport.use(
  new Strategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: clientCallback,
    },
    (accessToken, _refreshToken, profile, done) => {
      done(null, { profile, accessToken });
    },
  ),
);
