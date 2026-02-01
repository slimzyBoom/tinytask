import "dotenv/config"
import app from "./app";
import { connectDB } from "./common/configs/dbConfig";
import { connectToRedis } from "./common/configs/redisConfig";
const PORT = process.env.PORT || 3000;

connectDB();
connectToRedis();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
