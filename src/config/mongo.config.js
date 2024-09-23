import mongoose from "mongoose";
import { mongoUrl } from "../env/envoriment.js";

const mongoConfig = async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export default mongoConfig;
