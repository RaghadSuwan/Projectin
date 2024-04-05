import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((error) => {
      console.error(`error to connect db ${error}`);
    });
};

export default connectDB;
