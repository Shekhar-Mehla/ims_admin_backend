import mongoose from "mongoose";
const NotificationSchema = new mongoose.Schema(
  {
    profileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
      required: true,
    },
    type: {
      type: String,
      enum: ["otp", "login_alert", "application_update"],
      required: true,
    },
    subject: { type: String },
    body: { type: String },
    email: { type: String },
    sentAt: { type: Date, default: null },
    status: { type: String, enum: ["sent", "failed"], default: "sent" },
    readAt: { type: Date, default: null },
  },
  { timestamps: true }
);
notificationCollection = mongoose.model("Notification", NotificationSchema);
export default notificationCollection;
