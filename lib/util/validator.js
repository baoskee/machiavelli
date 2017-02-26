var Validator = function (spec) {
  this.isValid = spec.isValid;
  this.error = spec.error;

  return this;
};

Validator.prototype.validate = function (data, cb) {
  if (this.isValid(data))
    cb(null);
  else
    cb(this.error);
};

module.exports = Validator;
