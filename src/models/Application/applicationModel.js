import applicationCollection from "./applicationSchema.js";
// apply application model
export const applyApplicationModel = (applicationData) =>
  applicationCollection(applicationData).save();

// get all applications model
export const getAllApplicationsModel = () =>
  applicationCollection.find().populate("internshipId").populate("profileId");

//update application status model
export const updateApplicationStatusModel = (id, status) =>
  applicationCollection
    .findByIdAndUpdate(id, { status }, { new: true })
    .populate("profileId");
