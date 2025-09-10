import mongoose from "mongoose";

const AuthSchema = new mongoose.Schema(
  {
    // fName: { type: String, required: true },
    // lName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    providers: [{ provider: String, providerId: String }],
    verified: { type: Boolean, default: false },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

const authCollection = mongoose.model("Auth", AuthSchema);
export default authCollection;
