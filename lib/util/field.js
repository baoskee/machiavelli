var DataType = require('../datatype');
var Pipeline = require('./pipeline');
var Validator = require('./validator');

/**
 * Field for each schema attribute, allows easy implementation of validation
 * of nested schema objects.
 *
 * Philosophy: must maintain invariancy to avoid runtime errors, catch all errors that can
 * be caught by faulty specs here.
 * @param spec
 * @constructor
 */
var Field = function(spec) {
  if (!spec.type) { /* required key */
    throw new Error('Must specify type');
  }

  this.type = spec.type;

  /* required by default */
  (spec.required == false) ? this.required = false : this.required = true;

  /* custom validators */
  this.validators = spec.validators;

  if (spec.default != undefined) { /* if default specified */
    this.default = spec.default;
    this.required = false;
  }

  this.pipeline = new Pipeline([function validateType(data) {

  }]);
  this.pipeline.pipe(this.validators);
};

/**
 * ValidationError constructor for Field use
 * @param message
 * @constructor
 */
var ValidationError = function (message) {
  this.name = 'ValidationError';
  this.message = message;

  return this;
};
ValidationError.prototype = Object.create(Error.prototype);
Field.ValidationError = ValidationError;

Field.prototype.validateExistence = function (data) {
  if (data == undefined) throw new ValidationError('Missing required field');
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
    // Native data fields do not have instances
    if (this.type == String) {
      if (!DataType.String.isValid(data)) throw err;
    } else if (this.type == Number) {
      if (!DataType.Double.isValid(data)) throw err;
    } else if (this.type == Boolean) {
      if (!DataType.Boolean.isValid(data)) throw err;
    } else if (!(data instanceof this.type)){
      throw err;
    }
  }
};

/**
 * Throw error if one of the custom validators fail.
 * @param data
 */
Field.prototype.validateCustom = function (data) {
  this.validators.forEach(function (validator) {
    var err = new ValidationError('Custom validator failed');

    if (DataType.Function.isValid(validator)) {
      if (!validator(data)) throw err;
    } else if (validator instanceof Validator) {
      if (!validator.isValid(data)) throw validator.error || err;
    }
  });
};

/**
 * Throws error if fails at any step;
 * @param data
 */
Field.prototype.validateThrow = function (data) {
  /* Check required and existence */
  if (!this.required && data == undefined) { return; }
  this.validateExistence(data);

  /* Check type compliance */
  this.validateType(data);

  /* Check custom validators if key present and in array form */
  if (this.validators && DataType.Array.isValid(this.validators)) {
    this.validateCustom(data);
  }
};

Field.Validator = Validator;

/**
 * default value of field
 * @returns {*}
 */
Field.prototype.getDefault = function () {
  if (DataType.Function.isValid(this.default)) {
    return this.default();
  } else {
    return this.default;
  }
};

module.exports = Field;
