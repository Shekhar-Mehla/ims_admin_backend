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
    postedByName: { type: String, required: true },

    slug: { type: String, unique: true, index: true },
  },

  { timestamps: true }
);
const internshipCollection = mongoose.model("Internship", InternshipSchema);
export default internshipCollection;
