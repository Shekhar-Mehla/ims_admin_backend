import mongoose  from "mongoose";

const OTPSchema = new mongoose.Schema({
  authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth', required: true },
  code: { type: String, required: true },
  purpose: { type: String, enum: ['email_verification', 'reset_password'], required: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date, default: null }
}, { timestamps: true });

OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpCollection = mongoose.model('OTP', OTPSchema);
export default otpCollection

