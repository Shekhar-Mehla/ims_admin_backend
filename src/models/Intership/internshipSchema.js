import mongoose from "mongoose";
const InternshipSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    company: { type: String, required: true },
    location: { type: String },
    technologies: [{ type: String }],
    sectors: [{ type: String }],
    roles: [{ type: String }],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
  },
  { timestamps: true }
);
internshipCollection = mongoose.model("Internship", InternshipSchema);
export default internshipCollection;
