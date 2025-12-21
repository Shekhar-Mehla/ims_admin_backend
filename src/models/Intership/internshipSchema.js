import mongoose from "mongoose";
const InternshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },
    company: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    // ✅ Used in internship list
    technologies: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],
    applicationCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    postedByName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // ✅ To make sidebar dynamic (replace hard-coded values)
    stipend: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },
    duration: {
      type: String,
      trim: true,
      maxlength: 50,
      default: null,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: null,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "expired"],
      default: "active",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);
const internshipCollection = mongoose.model("Internship", InternshipSchema);
export default internshipCollection;
