import profileCollection from "./profileSchema.js";

export const createProfile = async (data) =>
  await profileCollection(data).save();
