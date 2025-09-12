import Joi from "joi";
import { OBJECT_ID, STRING, DATE } from "./joiConstantRule.js";
import dataValidator from "../middlewares/joiValidation.js";

const sessionDataValidator = (req, res, next) => {
  const schemaObject = Joi.object({
    authId: OBJECT_ID,
    accessTokenHash: STRING.required(),
    userAgent: STRING.optional(),
    ip: STRING.optional(),
    expiresAt: DATE.required(),
  }).options({ abortEarly: false });

  return dataValidator({ req, res, next, schemaObject });
};

export default sessionDataValidator;
