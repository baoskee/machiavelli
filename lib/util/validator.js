var Validator = function (spec) {
  this.isValid = spec.isValid;
  this.error = spec.error;

  return this;
};

module.exports = Validator;
