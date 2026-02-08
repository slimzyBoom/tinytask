import { Request, Response } from "express";
import { zodToFieldErrors } from "../errors/validationError";
import {
  registerDto,
  loginDto,
  resetPasswordDto,
  forgetPasswordDto,
  verifyEmailDto,
} from "./auth.dto";
import { HttpStatus } from "../common/enums/http_status_codes";
import { AppError } from "../errors/appError";
import expressAsyncHandler from "express-async-handler";
import { sendMail } from "../common/utils/handle_emails";
import { createOtp } from "../common/utils/createOtp";
import {
  emailVerificationTemplate,
  passwordResetTemplate,
} from "../common/utils/email_templates";
import { User, UserVerification } from "../models/User";
import { Token } from "../models/Tokens";
import {
  hashPassword,
  comparePassword,
  generate_tokens,
  hash_token,
  validate_refresh_token,
  generate_temp_token,
  validate_temp_token,
} from "./auth.service";
import { redisClient } from "../common/configs/redisConfig";
import axios from "axios";

const url = process.env.FRONTEND_URL as string;
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const isProd = process.env.NODE_ENV === "production";

export const registerController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const parseResult = registerDto.safeParse(req.body);
    if (!parseResult.success) {
      const validationError = zodToFieldErrors(parseResult.error);
      throw new AppError("Validation Errors", HttpStatus.BadRequest, {
        errors: validationError.errors,
      });
    }
    const { email, password, firstname, phone_number, lastname, university } =
      parseResult.data;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone_number }],
    }).lean();
    if (existingUser) {
      throw new AppError("User already exists", HttpStatus.Conflict);
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      phone_number,
      university,
    });
    const verification = await UserVerification.create({
      userId: newUser._id,
    });

    const { access_token, refresh_token } = generate_tokens({
      user_id: newUser._id,
      tier: verification ? verification.tier : 0,
    });
    const hashed_refresh_token = hash_token(refresh_token);

    const token = await Token.create({
      userId: newUser._id,
      token: hashed_refresh_token,
      expiresAt: new Date(Date.now() + SEVEN_DAYS_MS), // 7days
    });

    if (!token) {
      throw new AppError(
        "Failed to create user session",
        HttpStatus.ServerError,
      );
    }

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(HttpStatus.Created).json({
      success: true,
      message: "User registered successfully",
      data: { access_token },
    });
  },
);

export const loginController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const parseResult = loginDto.safeParse(req.body);
    if (!parseResult.success) {
      const validationError = zodToFieldErrors(parseResult.error);
      throw new AppError("Validation Errors", HttpStatus.BadRequest, {
        errors: validationError.errors,
      });
    }
    const { email, password } = parseResult.data;

    const user = await User.findOne({ email }).lean();
    if (!user) {
      throw new AppError("Invalid credentials", HttpStatus.Unauthorized);
    }

    const isPasswordValid = await comparePassword(
      password,
      user.password as string,
    );
    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", HttpStatus.Unauthorized);
    }

    const userVerification = await UserVerification.findOne({
      userId: user._id,
    }).lean();
    if (!userVerification) {
      throw new AppError(
        "User verification not found",
        HttpStatus.Unauthorized,
      );
    }

    const { access_token, refresh_token } = generate_tokens({
      user_id: user._id,
      tier: userVerification.tier,
    });
    const hashed_refresh_token = hash_token(refresh_token);

    const token = await Token.create({
      userId: user._id,
      token: hashed_refresh_token,
      expiresAt:  new Date(Date.now() + SEVEN_DAYS_MS), // 7days
    });

    if (!token) {
      throw new AppError(
        "Failed to create user session",
        HttpStatus.ServerError,
      );
    }

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: SEVEN_DAYS_MS,
    });

    res.status(HttpStatus.Success).json({
      success: true,
      message: "User logged in successfully",
      data: { access_token },
    });
  },
);

export const requestEmailVerificationController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userCookie = req.user;
    if (!userCookie) {
      throw new AppError("Unauthorized", HttpStatus.Unauthorized);
    }
    const existingUser = await User.findById(userCookie.user_id).lean();
    if (!existingUser) {
      throw new AppError("User not found", HttpStatus.NotFound);
    }
    const otp = createOtp();
    const hashedIdentity = hash_token(existingUser._id.toString());

    const existingOtp = await redisClient.get(
      `emailVerification:${hashedIdentity}`,
    );
    if (existingOtp) {
      throw new AppError(
        "OTP already sent. Please wait before requesting a new one.",
        HttpStatus.TooManyRequests,
      );
    }

    await redisClient.set(
      `emailVerification:${hashedIdentity}`,
      JSON.stringify({ otp, attempts: 0 }),
      {
        EX: 10 * 60,
      },
    );

    // Send verification email
    const result = await sendMail({
      to: existingUser.email,
      subject: "Tiny Task email verification",
      html: emailVerificationTemplate(
        `${existingUser.firstname} ${existingUser.lastname}`,
        otp,
      ),
    });

    if (!result || result?.rejected.length > 0) {
      throw new AppError(
        "Failed to send verification email",
        HttpStatus.ServerError,
      );
    }

    res
      .status(HttpStatus.Success)
      .json({ success: true, message: "Verification email sent" });
  },
);

export const verifyEmailController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const userCookie = req.user;
    if (!userCookie)
      throw new AppError("Unauthorized", HttpStatus.Unauthorized);

    const parsedResult = verifyEmailDto.safeParse(req.body);
    if (!parsedResult.success) {
      const formatted = zodToFieldErrors(parsedResult.error);
      throw new AppError(formatted.message, HttpStatus.BadRequest, {
        errors: formatted.errors,
      });
    }

    const { otp } = parsedResult.data;

    const existingUser = await User.findById(userCookie.user_id).lean();
    if (!existingUser)
      throw new AppError("User not found", HttpStatus.NotFound);

    const hashedIdentity = hash_token(existingUser._id.toString());
    const key = `emailVerification:${hashedIdentity}`;

    const storedOtp = await redisClient.get(key);
    if (!storedOtp) {
      throw new AppError(
        "OTP expired or not found. Please request a new one.",
        HttpStatus.BadRequest,
      );
    }

    const parsedOtp = JSON.parse(storedOtp) as {
      otp: string;
      attempts: number;
    };

    if (parsedOtp.attempts >= 5) {
      await redisClient.del(key);
      throw new AppError(
        "Maximum OTP verification attempts exceeded. Please request a new OTP.",
        HttpStatus.TooManyRequests,
      );
    }

    if (parsedOtp.otp !== otp) {
      const ttl = await redisClient.ttl(key);
      const nextTTL = ttl > 0 ? ttl : 10 * 60;

      await redisClient.set(
        key,
        JSON.stringify({
          otp: parsedOtp.otp,
          attempts: parsedOtp.attempts + 1,
        }),
        { EX: nextTTL },
      );

      throw new AppError(
        "Invalid OTP. Please try again.",
        HttpStatus.BadRequest,
      );
    }

    await redisClient.del(key);

    const updatedDoc = await UserVerification.updateOne(
      { userId: existingUser._id },
      { $set: { emailVerified: true } },
    );
    if (!updatedDoc.acknowledged) {
      throw new AppError(
        "User verification not updated",
        HttpStatus.ServerError,
      );
    }
    res
      .status(HttpStatus.Success)
      .json({ success: true, message: "Email verified successfully" });
  },
);

export const forgetPasswordController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const parseResult = forgetPasswordDto.safeParse(req.body);
    if (!parseResult.success) {
      const validationError = zodToFieldErrors(parseResult.error);
      throw new AppError("Validation Errors", HttpStatus.BadRequest, {
        errors: validationError.errors,
      });
    }
    const { email } = parseResult.data;
    const token = generate_temp_token(email);
    if (!token) {
      throw new AppError(
        "Could not generate password reset token",
        HttpStatus.ServerError,
      );
    }

    const result = await sendMail({
      to: email,
      subject: "Tiny Task password reset",
      html: passwordResetTemplate(url, token),
    });

    if (!result || result?.rejected.length > 0) {
      throw new AppError(
        "Failed to send verification email",
        HttpStatus.ServerError,
      );
    }
    res
      .status(HttpStatus.Success)
      .json({ success: true, message: "Password reset email sent" });
  },
);

export const resetPasswordController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.query;
    const { password, confirm_password } = req.body;
    const parsedResult = resetPasswordDto.safeParse({
      password,
      confirm_password,
      token,
    });
    if (!parsedResult.success) {
      const validationErrors = zodToFieldErrors(parsedResult.error);
      throw new AppError("Validation Errors", HttpStatus.BadRequest, {
        errors: validationErrors.errors,
      });
    }
    const decoded = validate_temp_token(token as string);
    if (!decoded) {
      throw new AppError("Invalid or expired token", HttpStatus.BadRequest);
    }

    const hashedPassword = await hashPassword(password);
    const user = await User.findOneAndUpdate(
      { email: decoded.email },
      { $set: { password: hashedPassword } },
      { new: true },
    ).lean();
    if (!user) {
      throw new AppError("User not found", HttpStatus.NotFound);
    }

    res
      .status(HttpStatus.Success)
      .json({ success: true, message: "Password reset successfully" });
  },
);

export const refreshTokenController = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const refresh_token = req.cookies.refresh_token;
    if (!refresh_token) {
      throw new AppError("No refresh token provided", HttpStatus.Unauthorized);
    }
    const decoded = validate_refresh_token(refresh_token);
    if (!decoded) {
      throw new AppError("Invalid refresh token", HttpStatus.Unauthorized);
    }
    const hashed_refresh_token = hash_token(refresh_token);
    const existingToken = await Token.findOne({
      userId: decoded.user_id,
      token: hashed_refresh_token,
    });
    if (!existingToken) {
      throw new AppError("Token invalid", HttpStatus.Unauthorized);
    }
    await Token.deleteOne({ _id: existingToken._id });

    const { access_token, refresh_token: new_refresh_token } = generate_tokens({
      user_id: decoded.user_id,
      tier: decoded.tier,
    });
    const new_hashed_refresh_token = hash_token(new_refresh_token);

    await Token.create({
      userId: decoded.user_id,
      token: new_hashed_refresh_token,
      expiresAt: new Date(Date.now() + SEVEN_DAYS_MS), // 7days
    });

    res.cookie("refresh_token", new_refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: SEVEN_DAYS_MS, // 7 days
    });

    res.status(HttpStatus.Created).json({
      success: true,
      message: "Token refreshed successfully",
      data: { access_token },
    });
  },
);

export const handleGoogleAuth = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { profile, accessToken } = req.user as any;

    if (!profile || !accessToken) {
      throw new AppError("Google auth error", HttpStatus.ServerError);
    }

    const email = profile.emails?.[0]?.value;
    const emailVerified = profile.emails?.[0]?.verified ?? false;

    if (!email) {
      throw new AppError(
        "Google account must have an email",
        HttpStatus.BadRequest,
      );
    }

    const existingUser = await User.findOne({ email }).lean();

    // LOGIN FLOW
    if (existingUser) {
      const userVerification = await UserVerification.findOne({
        userId: existingUser._id,
      }).lean();
      if (!userVerification) {
        throw new AppError(
          "Missing verification schema",
          HttpStatus.ServerError,
        );
      }

      const { access_token, refresh_token: new_refresh_token } =
        generate_tokens({
          user_id: existingUser._id,
          tier: userVerification.tier,
        });

      await Token.create({
        userId: existingUser._id,
        token: hash_token(new_refresh_token),
        expiresAt: new Date(Date.now() + SEVEN_DAYS_MS),
      });

      res.cookie("refresh_token", new_refresh_token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        maxAge: SEVEN_DAYS_MS,
      });

      if (isProd) {
        res.status(301).redirect(`${url}/complete-signup`);
        return;
      }
      res.status(HttpStatus.Success).json({
        success: true,
        message: "Authenticated successfully",
        data: { access_token },
      });
      return;
    }

    // REGISTER FLOW (new user)
    const { data } = await axios.get(
      "https://people.googleapis.com/v1/people/me?personFields=phoneNumbers",
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const phones = (data.phoneNumbers ?? []).map((p: any) => ({
      value: p.value,
      verified: p.metadata?.verified ?? false,
    }));

    const newUser = await User.create({
      firstname: profile.name?.givenName ?? "",
      lastname: profile.name?.familyName ?? "",
      email,
      phone_number: phones[0]?.value ?? "",
    });

    const newUserVerification = await UserVerification.create({
      userId: newUser._id,
      emailVerified,
    });

    const { access_token, refresh_token: new_refresh_token } = generate_tokens({
      user_id: newUser._id,
      tier: newUserVerification.tier,
    });

    await Token.create({
      userId: newUser._id,
      token: hash_token(new_refresh_token),
      expiresAt: new Date(Date.now() + SEVEN_DAYS_MS),
    });

    res.cookie("refresh_token", new_refresh_token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: SEVEN_DAYS_MS,
    });

    if (isProd) {
      res.status(301).redirect(`${url}/complete-signup`);
      return;
    }
    res.status(HttpStatus.Success).json({
      success: true,
      message: "Authenticated successfully",
      data: { access_token },
    });
  },
);
