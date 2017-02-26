var async = require('async');

/**
 * The constraint pipeline
 * @param constraints - array of constraints
 * @constructor
 */
var Pipeline = function (constraints) {
  this.constraints = constraints || [];
};

Pipeline.prototype.pipe = function (constraint) {
  this.constraints.push(constraint);
};

Pipeline.prototype.exec = function (data, cb) {
  async.eachSeries(this.constraints, function (constraint, cb) {
    constraint.validate(data, function (err) {
      if (err) return cb(err);
      cb(null);
    });
  }, function (err) {
    if (err) return cb(err);
    cb(null);
  });
};
