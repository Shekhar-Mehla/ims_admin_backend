import sessionCollection from "./sessionSchema.js";

export const createSession = async (obj) => {
  await sessionCollection(obj).save();
};
export const getsessionByAccessToken = async (accessToken) =>
  await sessionCollection.findOne({ accessToken });
export const deleteManySessionByAuthId = async (authId) =>
  await sessionCollection.deleteMany({ authId });
