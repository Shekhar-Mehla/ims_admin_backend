import mongoose from "mongoose";

export const NotificationSchema = new mongoose.Schema(
  {
    authId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ["reminder", "internship_posted", "application_update", "system"],
      required: true,
    },
    referenceId: { type: mongoose.Schema.Types.ObjectId },
    referenceModel: {
      type: String,
      enum: ["Internship", "Application", "Profile"],
    },
    isRead: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);
const notificationCollection = mongoose.model(
  "Notification",
  NotificationSchema
);
export default notificationCollection;
