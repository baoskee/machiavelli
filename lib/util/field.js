var DataType = require('../datatype');
var Validator = require('./validator');

/**
 * Field for each schema attribute, allows easy implementation of validation
 * of nested schema objects.
 * @param spec
 * @constructor
 */
var Field = function(spec) {
  if (!spec.type) { throw new Error('Must specify type'); }
  this.type = spec.type;
  this.required = spec.required;
  this.validate = spec.validate;
};

/**
 * ValidationError constructor for Field use
 * @param message
 * @constructor
 */
var ValidationError = function (message) {
  this.name = 'ValidationError';
  this.message = message;
};
ValidationError.prototype = Object.create(Error.prototype);
Field.ValidationError = ValidationError;

Field.prototype.validateExistence = function (data) {
  if (data == undefined) throw ValidationError('Missing required field');
};

/**
 * Throw error if type does not conform.
 * @param data
 */
Field.prototype.validateType = function (data) {
  var err = new ValidationError('Field input does not conform to data type');
  if (this.type instanceof DataType) {
    if (!this.type.isValid(data)) throw err;
  } else {
    if (!(data instanceof this.type)) throw err;
  }
};

/**
 * Throw error if one of the custom validators fail.
 * @param data
 */
Field.prototype.validateCustom = function (data) {
  this.validate.forEach(function (validator) {
    var err = new ValidationError('Custom validator failed');
    if (validator instanceof Validator) {
      if (!validator.isValid(data)) throw validator.error || err;
    } else if (!validator(data)) {
      throw err;
    }
  });
};

/**
 * Throws error if fails at any step;
 * @param data
 */
Field.prototype.validate = function (data) {
  /* Check required and existence */
  if (this.required == false && data == undefined ) { return; }
  this.validateExistence(data);

  /* Check type compliance */
  this.validateType(data);

  /* Check custom validators if key present and in array form */
  if (this.validate && DataType.Array.isValid(this.validate)) {
    this.validateCustom(data);
  }
};

Field.Validator = Validator;

module.exports = Field;
