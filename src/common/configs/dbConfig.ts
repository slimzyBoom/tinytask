import mongoose from "mongoose";

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully");
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

mongoose.connection.on("error", (err) => {
  console.log(`MongoDB connection error: ${err.message}`);
});

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL as string, {
      serverSelectionTimeoutMS: 30000,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`Failed to connect to MongoDB: ${message}`);
    process.exit(1);
  }
};

