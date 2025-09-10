import responseClient from "../utility/responseClient.js";

const errorMiddleWare = (error, req, res, next) => {
  const statusCode = error.statusCode || 500;
  let message;
  if (statusCode >= 500) {
    message = error.message || "internal server error";
  } else {
    if (statusCode >= 400 && statusCode < 500) {
      message = error.message || "bad request";
    }
  }

  responseClient({ res, statusCode, message });
};
export default errorMiddleWare;
