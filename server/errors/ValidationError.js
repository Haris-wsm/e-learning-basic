module.exports = function (errors) {
  this.message = 'Validation errors';
  this.errors = errors;
  this.status = 400;
};
