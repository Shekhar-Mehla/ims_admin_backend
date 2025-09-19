import Joi from 'joi';

export const OBJECT_ID = Joi.string().regex(/^[0-9a-fA-F]{24}$/).required();
export const VERIFY_OTP = Joi.string().regex(/^[0-9]{6}$/).required();
export const EMAIL = Joi.string().email().required();
export const STRING = Joi.string();
export const BOOLEAN = Joi.boolean();
export const DATE = Joi.date();
export const STATUS = Joi.string().valid('pending', 'accepted', 'rejected');
export const PURPOSE = Joi.string().valid('email_verification', 'reset_password');
export const NOTIFICATION_TYPE = Joi.string().valid('otp', 'login_alert', 'application_update');
export const NOTIFICATION_STATUS = Joi.string().valid('sent', 'failed');
