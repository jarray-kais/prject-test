const extractValidationErrors = (err) => {
  const validationErrors = {};
  if (err.name === "ValidationError") {
    for (const field in err.errors) {
      if (err.errors.hasOwnProperty(field)) {
        const errorMessage = err.errors[field].message;
        validationErrors[field] = errorMessage;
      }
    }
  }
  return validationErrors;
};
export const normalizeErrors = (err, req, res, next) => {

  const statusCode = err.statusCode || 400;

  // Extract validation errors if applicable
  const validationErrors = extractValidationErrors(err);

  // Send the normalized response
  res.status(statusCode).json({
    success: false,
    statusCode,
    message: err.message || "Something went wrong",
    name: err.name || "Server Error",
    validationErrors: Object.keys(validationErrors).length
      ? validationErrors
      : null,
  });
};

export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    name: "NotFoundError",
    message: "Route not found",
  });
};
export const globalErrorHandler = (err, req, res, next) => {

    res.status(err.statusCode || 500).json({
        success: false,
        statusCode: err.statusCode || 500,
        name: err.name || 'InternalServerError',
        message: err.message || 'An internal server error occurred',
    });
};

