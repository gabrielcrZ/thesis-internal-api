import mongoose from "mongoose";

const connectDB = () => {
  return mongoose
    .connect(process.env.CONNECTION_STRING)
    .then(() => {
      console.log("Connected to MongoDB...");
    })
    .catch((err) => console.log(err.message));
};

export default connectDB;
