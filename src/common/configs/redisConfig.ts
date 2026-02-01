import { createClient } from "redis";

export const redisClient = createClient({
  username: process.env.REDIS_USERNAME as string, // default
  password: process.env.REDIS_PASSWORD as string, // qqQ8CBaQJmjeiWXStZWK29scXBXmz2vX
  socket: {
    host: process.env.REDIS_HOST, 
    port: Number(process.env.REDIS_PORT), 
  },
});

redisClient.on("connect", () => {
  console.log("Redis connected successfully")
});

redisClient.on("disconnect", () => {
  console.log("Redis disconnected")
})

redisClient.on("error", (err) => {
  console.log(`Redis connection error: ${err.message}`)
});

export const connectToRedis = async () => {
  try {
    if(!redisClient.isOpen){
      await redisClient.connect()
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.log(`Failed initial Redis connection: ${message}`);
  }
};
