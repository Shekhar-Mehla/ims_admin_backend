import Joi from "joi";
import { EMAIL, STRING, VERIFY_OTP } from "./joiConstantRule.js";
import dataValidator from "../middlewares/joiValidation.js";

const registerDataValidator = (req, res, next) => {
  const schemaObject = Joi.object({
    fName: STRING.required(),
    lName: STRING.required(),
    email: EMAIL.required(),
    password: STRING.min(6).required(),
    technologies: Joi.array().items(STRING).default([]),
    sectors: Joi.array().items(STRING).default([]),
    roles: Joi.array().items(STRING).default([]),
  }).options({ abortEarly: false });

  return dataValidator(req, res, next, schemaObject);
};

export default registerDataValidator;
export const loginDataValidator = (req, res, next) => {
  const schemaObject = Joi.object({
    email: EMAIL.required(),
    password: STRING.min(8).required(),
  }).options({ abortEarly: false });
  return dataValidator(req, res, next, schemaObject);
};
export const activateDataValidator = (req, res, next) => {
  const schemaObject = Joi.object({
    otp: VERIFY_OTP.required(),
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
