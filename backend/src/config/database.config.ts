import mongoose from "mongoose";
import { Env } from "./env.config";

const connectDatabase = async () => {
  try {
    await mongoose.connect(Env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
    });

    console.log("Connected to MongoDB Successfully");
  } catch (error) {
    console.log("Error while connecting to Database:", error);
    process.exit(1);
  }
};

export default connectDatabase;
