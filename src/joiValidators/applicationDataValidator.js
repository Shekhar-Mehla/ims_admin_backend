import Joi from "joi";
import { OBJECT_ID, STRING, STATUS } from "./joiConstantRule.js";

const applicationDataValidator = (req, res, next) => {
  const schemaObject = Joi.object({
    internshipId: OBJECT_ID,
    profileId: OBJECT_ID,
    resumeUrl: STRING.required(),
    status: STATUS.default("pending"),
  }).options({ abortEarly: false });
  return dataValidator({ req, res, next, schemaObject });
};

export default applicationDataValidator;
