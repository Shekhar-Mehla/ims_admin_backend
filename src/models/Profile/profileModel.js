import profileCollection from "./profileSchema.js";

export const createProfile = async (data) =>
  await profileCollection(data).save();

export const getProfile = async (authId) =>
  await profileCollection.findOne({ authId });

export const matchProfiles = () => {
  profileCollection.find({
    technologies: { $in: internship.technologies },
    sectors: { $in: internship.sectors },
    roles: { $in: internship.roles },
  });
};


export const getallUsers =async()=> await profileCollection.find()
