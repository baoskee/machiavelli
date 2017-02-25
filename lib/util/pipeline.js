/**
 * The validator pipeline
 * @param validators - array of functions to add to pipeline
 * @constructor
 */
var Pipeline = function (validators) {
  this.validators = [];
};

Pipeline.prototype.pipe = function (validator) {
  this.validators.push(validator);
};
