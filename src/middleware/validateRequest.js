const { validationResult } = require('express-validator');
const { ApiError } = require('./errorHandler');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => ({
      field: err.param,
      message: err.msg
    }));

    throw new ApiError(400, {
      status: 'fail',
      errors: errorMessages
    });
  }
  
  next();
};

module.exports = validateRequest;