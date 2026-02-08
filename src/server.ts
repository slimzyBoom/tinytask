import "dotenv/config"
import app from "./app";
import passport from "passport";
import "./common/configs/passportConfig"
import { connectDB } from "./common/configs/dbConfig";
import { connectToRedis } from "./common/configs/redisConfig";
const PORT = Number(process.env.PORT);

connectDB();
connectToRedis();

app.use(passport.initialize())

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
