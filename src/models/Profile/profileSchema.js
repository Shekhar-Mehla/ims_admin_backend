import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema(
  {
    fName: { type: String, required: true },
    lName: { type: String, required: true },
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    avatarUrl: { type: String, default: null },
    resumeUrl: { type: String, default: null },
    technologies: [{ type: String }],
    sectors: [{ type: String }],
    roles: [{ type: String }],
  },
  { timestamps: true }
);

const profileCollection = mongoose.model("Profile", ProfileSchema);
export default profileCollection;
