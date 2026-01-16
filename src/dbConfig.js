import mongoose from "mongoose";

const connection = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("mongo connection string is not found");
    }
    await mongoose.connect(process.env.MONGO_URI);
   
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export default connection;
