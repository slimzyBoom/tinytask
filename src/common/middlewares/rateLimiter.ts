import rateLimit from "express-rate-limit";
import { HttpStatus } from "../enums/http_status_codes";
import { RequestHandler } from "express";

export const authRateLimiter : RequestHandler = rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: { status: HttpStatus.TooManyRequests, message: "Too many requests, try again later."},
})