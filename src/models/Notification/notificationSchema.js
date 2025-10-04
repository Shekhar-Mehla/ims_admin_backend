import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    // profileId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Profile",
    //   default: null, // Profile may not exist yet
    // },
    createdBy: {
      type: String, // or ObjectId if you store admin IDs
      required: true,
    },

    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      default: null, // Used before profile is created
    },
    type: {
      type: String,
      enum: [
        "otp", // Email verification or password reset
        "login_alert", // New login detected
        "application_update", // Application status changed
        "internship_posted", // New internship created
        "internship_updated", // Internship edited
        "resume_uploaded", // Resume added or changed
        "profile_updated", // Profile info changed
        "admin_message", // Custom admin alert
        "system_alert", // Platform-wide announcements
      ],
      required: true,
    },
    subject: { type: String, required: true },
    body: { type: String, required: true },
  
    sentAt: { type: Date, default: Date.now },
    markAsRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const notificationCollection = mongoose.model(
  "Notification",
  NotificationSchema
);
export default notificationCollection;
