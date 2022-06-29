module.exports = (err, req, res, next) => {
  const { message, status, errors } = err;

  let validationError;

  if (errors) {
    validationError = {};
    errors.forEach((err) => {
      validationError[err.param] = err.msg;
    });
  }

  res.status(status).json({ message, validationError });
};
