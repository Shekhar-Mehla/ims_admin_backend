import applicationCollection from "./applicationSchema.js";
// apply application model
export const applyApplicationModel = (applicationData) =>
  applicationCollection(applicationData).save();

export const getApplicationByIdModel = (id) =>
  applicationCollection
    .findById(id)
    .populate("internshipId")
    .populate({ path: "profileId", populate: { path: "authId" } });

// get all applications model
export const getAllApplicationsModel = () =>
  applicationCollection
    .find()
    .populate("internshipId")
    .populate({ path: "profileId", populate: { path: "authId" } });

//update application status model
export const updateApplicationStatusModel = (id, status) =>
  applicationCollection
    .findByIdAndUpdate(id, { status }, { new: true })
    .populate({ path: "profileId", populate: { path: "authId" } });
