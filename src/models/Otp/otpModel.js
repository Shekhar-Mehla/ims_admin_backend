import otpCollection from "./otpSchema.js";

export const createOtpModel = async (obj) => await otpCollection(obj).save();
