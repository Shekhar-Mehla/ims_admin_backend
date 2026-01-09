const responseClient = ({ res, statusCode = 200, message, payload }) => {
  let status;
  if (statusCode >= 200 && statusCode <= 299) {
    status = "success";
  } else {
    status = "error";
  }
  return res.status(statusCode).json({
    status,
    message,
    payload,
  });
};
export default responseClient;
