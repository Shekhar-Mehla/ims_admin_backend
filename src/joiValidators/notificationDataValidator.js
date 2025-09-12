import Joi from "joi";
import {
  OBJECT_ID,
  STRING,
  DATE,
  EMAIL,
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
} from "./joiConstantRule.js";

const notificationDataValidator = (req, res, next) => {
  const schemaObject = Joi.object({
    profileId: OBJECT_ID,
    type: NOTIFICATION_TYPE.required(),
    subject: STRING.optional(),
    body: STRING.optional(),
    email: EMAIL.optional(),
    sentAt: DATE.allow(null),
    status: NOTIFICATION_STATUS.default("sent"),
    readAt: DATE.allow(null),
  }).options({ abortEarly: false });
  return dataValidator({ req, res, next, schemaObject });
};

export default notificationDataValidator;
