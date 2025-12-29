import mongoose from "mongoose"
import { env } from "../../../env";

export const conectDb = async () => {
  try{
    await mongoose.connect(env.DATABASE_URL);
    console.log("MongoDB connected");
  } catch(error) {
    console.error("Error connecting to MongoDB:", error);
  }
}