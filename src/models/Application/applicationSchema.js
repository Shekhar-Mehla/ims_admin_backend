import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // 🔗 REFERENCES ONLY (no duplicated data)
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },

    // 📋 APPLICATION-SPECIFIC DATA ONLY

    // Status & workflow
    status: {
      type: String,
      enum: ["pending", "under_review", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },

    // Internship-specific preferences (unique to this application)
    preferences: {
      startDate: { type: Date, required: true },
      duration: {
        type: String,
        required: true,
        enum: ["1-month", "2-months", "3-months", "6-months", "flexible"],
      },
      expectedStipend: { type: String, trim: true, maxlength: 50 },
      workMode: {
        type: String,
        required: true,
        enum: ["remote", "on-site", "hybrid"],
      },
      whyThisInternship: {
        type: String,
        required: true,
        minlength: 50,
        maxlength: 2000,
      },
      coverLetter: {
        type: String,
        trim: true,
        maxlength: 1500,
      },
    },

    // Files specific to this application
    documents: {
      resumeUrl: { type: String, trim: true, maxlength: 500 },
      resumePublicId: { type: String, trim: true, maxlength: 200 },
      portfolioUrl: { type: String, trim: true, maxlength: 500 },
      portfolioPublicId: { type: String, trim: true, maxlength: 200 },
    },

    // Legal & source tracking
    agreeTerms: { type: Boolean, required: true, default: false },
    source: {
      type: String,
      enum: ["direct", "referral", "job_board", "social_media"],
      default: "direct",
    },

    // Timestamps
    submittedAt: { type: Date, default: Date.now },

    // Employer review data (added later when reviewing)
    reviewedAt: { type: Date },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    reviewNotes: { type: String, trim: true, maxlength: 1000 },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
);

const applicationCollection = mongoose.model("Application", applicationSchema);
export default applicationCollection;
