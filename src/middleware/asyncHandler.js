/**
 * Async Error Handler Wrapper
 * Wraps async controller functions to automatically catch errors
 * and pass them to Express error handling middleware
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((next) => {
      console.log("Async Handler Caught Error:");
      console.log(next);
      res.status(500).json({
        success: false,
        message: 'Internal Server Error',
        errors: next.message || 'An unexpected error occurred'
      });
    });
  };
};

module.exports = asyncHandler;