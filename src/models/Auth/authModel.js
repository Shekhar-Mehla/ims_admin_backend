import authCollection from "./authSchema.js";

export const checkUserByEmail = async (email) =>
  await authCollection.findOne({ email });
export const createUser = async (data) => await authCollection(data).save();
