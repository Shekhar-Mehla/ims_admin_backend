import Joi from "joi";
import responseClient from "../utility/responseClient.js";

const dataValidator = (req, res, next, schemaObject) => {
  try {
    console.log(req.params, "pra");
    if (req.params && Object.keys(req.params).length > 0) {
      const { error, value } = schemaObject.validate(req.params, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
      });
      if (error) {
        return responseClient({
          res,
          statusCode: 400,
          message: "Invalid route parameters",
        });
      }
      req.params = value;
    }

    if (req.query && Object.keys(req.query).length > 0) {
      const { error, value } = schemaObject.validate(req.query, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
      });
      if (error) {
        return responseClient({
          res,
          statusCode: 400,
          message: "Invalid query parameters",
          payload: { errors: error.details.map((d) => d.message) },
        });
      }
      req.query = value;
    }

    if (req.body && Object.keys(req.body).length > 0) {
      const isArray = Array.isArray(req.body);
      const schemaToUse = isArray
        ? Joi.array().items(schemaObject)
        : schemaObject;

      const { error, value } = schemaToUse.validate(req.body, {
        abortEarly: false,
        allowUnknown: false,
        stripUnknown: true,
      });

      if (error) {
        return responseClient({
          res,
          statusCode: 400,
          message: "Invalid request body",
        });
      }

      req.body = value;
    }

    next();
  } catch (error) {
    console.error("Validation middleware error:", error);
    next(error);
  }
};

export default dataValidator;
