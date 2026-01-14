import Joi from "joi";
import { EMAIL, STRING, VERIFY_OTP } from "./joiConstantRule.js";
import dataValidator from "../middlewares/joiValidation.js";

export const loginDataValidator = (req, res, next) => {
  const schemaObject = Joi.object({
    email: EMAIL.required(),
    password: STRING.min(8).required(),
  }).options({ abortEarly: false });
  return dataValidator(req, res, next, schemaObject);
};
export const forgetPasswordDataValidator = (req, res, next) => {
  const schemaObject = Joi.object({
    email: EMAIL.required(),
    newPassword: STRING.min(8).required(),

    otp: STRING.length(6).required(),
  }).options({ abortEarly: false });
  return dataValidator(req, res, next, schemaObject);
};

export const generateNewOtpDataValidator = (req, res, next) => {
  const schemaObject = Joi.object({
    email: EMAIL.required(),
  }).options({ abortEarly: false });
  return dataValidator(req, res, next, schemaObject);
};
