import Joi from "joi";
import { OBJECT_ID, STRING } from "./joiConstantRule.js";
import dataValidator from "../middlewares/joiValidation.js";

const internshipDataValidator = (req, res, next) => {
  const schemaObject = Joi.object({
    title: STRING.required(),
    description: STRING.optional(),
    company: STRING.required(),
    location: STRING.optional(),
    technologies: Joi.array().items(STRING),
    sectors: Joi.array().items(STRING),
    roles: Joi.array().items(STRING),
    postedBy: OBJECT_ID,
  }).options({ abortEarly: false });
  return dataValidator({ req, res, next, schemaObject });
};

export default internshipDataValidator;
