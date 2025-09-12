import Joi from "joi";
import { OBJECT_ID, STRING } from "./joiConstantRule.js";

const profileDataValidator = () => {
  const schemaObject = Joi.object({
    authId: OBJECT_ID,
    name: STRING.required(),
    avatarUrl: STRING.allow(null),
    resumeUrl: STRING.allow(null),
    technologies: Joi.array().items(STRING),
    sectors: Joi.array().items(STRING),
    roles: Joi.array().items(STRING),
  }).options({ abortEarly: false });
  return dataValidator({ req, res, next, schemaObject });
};

export default profileDataValidator;
