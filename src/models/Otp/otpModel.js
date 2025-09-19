import otpCollection from "./otpSchema.js";

export const createOtpModel = async (obj) => await otpCollection(obj).save();
export const getOtpCollection = async (otp) =>
  await otpCollection.findOne({ code: otp })
