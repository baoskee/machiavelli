var Constraint = function (validator, error) {
  this.validator = validator;
  this.error = error;
};

Constraint.prototype.validate = function (data, cb) {
  if (this.validator(data)) {
    cb(null);
  } else {
    cb(this.error || new Error('Custom constraint failed.'));
  }
};
