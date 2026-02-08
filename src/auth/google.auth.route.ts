import express from "express";
import passport from "passport";
import { handleGoogleAuth } from "./auth.controller";
const router = express.Router();
const frontendUrl = process.env.FRONTEND_URL as string;

router.get(
  "/",
  passport.authenticate("google", {
    scope: [
      "openid",
      "profile",
      "email",
      "https://www.googleapis.com/auth/user.phonenumbers.read",
    ],
  })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${frontendUrl}/login`,
  }),
  handleGoogleAuth
);

export default router;
