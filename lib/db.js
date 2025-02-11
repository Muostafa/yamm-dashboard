import mongoose from "mongoose";

global.mongoose = global.mongoose || {
  conn: null,
  promise: null,
};

export async function connectDB() {
  console.log("Connecting to database...");
  try {
    if (global.mongoose.conn && mongoose.connection.readyState === 1) {
      console.log("Using existing database connection.");
      return global.mongoose.conn;
    }

    if (!global.mongoose.promise) {
      const conString = process.env.MONGO_URL;

      global.mongoose.promise = mongoose.connect(conString, {
        autoIndex: true,
      });

      console.log("Creating new database connection...");
    }

    global.mongoose.conn = await global.mongoose.promise;
    console.log("Database connected.");
    return global.mongoose.conn;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error("Database connection failed");
  }
}

export const disconnect = async () => {
  if (global.mongoose.conn) {
    console.log("Disconnecting from database...");
    await mongoose.disconnect();
    global.mongoose.conn = null;
    global.mongoose.promise = null;
    console.log("Database disconnected.");
  }
};

export default connectDB;
