import profileCollection from "./profileSchema.js";

export const createProfile = async (data) =>
  await profileCollection(data).save();

export const getProfile = async (authId) =>
  await profileCollection.findOne({ authId });
