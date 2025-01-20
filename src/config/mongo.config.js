import mongoose from "mongoose";
import { mongoUri } from "../env/envoriment.js";

const connectDB = async () => {
  try {
    const mongooseConnection = await mongoose.connect(mongoUri);
    return `MongoDB connected: ${mongooseConnection.connection.host}`;
  } catch (error) {
    process.exit(1);
    return error;
  }
};

export default connectDB;
