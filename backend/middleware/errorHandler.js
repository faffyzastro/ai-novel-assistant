// Centralized error handler middleware for Express
module.exports = (err, req, res, next) => {
  // Log error (could be enhanced with Winston/Morgan later)
  console.error(err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  // In production, avoid leaking stack traces
  const response = {
    error: message,
  };
  if (process.env.NODE_ENV !== 'production') {
    response.details = err.stack;
  }

  res.status(status).json(response);
}; 