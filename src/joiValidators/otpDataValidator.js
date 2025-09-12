import Joi from "joi";
import { OBJECT_ID, STRING, DATE, PURPOSE } from "./joiConstantRule.js";

const otpDataValidator = () => {
  const schemaObject = Joi.object({
    authId: OBJECT_ID,
    code: STRING.required(),
    purpose: PURPOSE.required(),
    expiresAt: DATE.required(),
    usedAt: DATE.allow(null),
  }).options({ abortEarly: false });
  return dataValidator({ req, res, next, schemaObject });
};

export default otpDataValidator;
