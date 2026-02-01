import { Router } from "express";
import {
  registerController,
  loginController,
  requestEmailVerificationController,
  verifyEmailController,
  forgetPasswordController,
  resetPasswordController,
  refreshTokenController,
} from "./auth.controller";
import { authRateLimiter } from "../common/middlewares/rateLimiter";
import { verifyToken } from "../common/middlewares/verifyToken";

const router = Router();

router.post("/register", authRateLimiter, registerController);
router.post("/login", authRateLimiter, loginController);
router.post(
  "/request-email-verification",
  authRateLimiter,
  verifyToken,
  requestEmailVerificationController,
);
router.post("/verify-email", verifyToken, verifyEmailController);
router.post("/forget-password", authRateLimiter, forgetPasswordController);
router.post("/reset-password", authRateLimiter, resetPasswordController);
router.post("/refresh-token", authRateLimiter, refreshTokenController);

export default router;
