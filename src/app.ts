import express from "express";
import authRouter from "./auth/auth.route";
import cookieParser from "cookie-parser"
import cors from "cors";
import { HttpStatus } from "./common/enums/http_status_codes";
import { corsOptions } from "./common/configs/corsOptions";
import { errorHandler } from "./common/middlewares/errorHandler";
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);

app.use((_req, res) => {
  res.status(HttpStatus.NotFound).json({ message: "404 Not Found" });
});

app.use(errorHandler);

export default app;