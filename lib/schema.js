var DataType = require('./datatype');

/**
 * @param fields
 * @returns {Schema}
 * @constructor
 */
var Schema = function (fields) {
  this.fields = fields;
  return this;
};

/*
 * Container for helper validation functions
 */
var validate = {};

/**
 * Confirms data adheres to field type
 * @param field - JSON of schema attribute
 * @param data - passed in JSON to be validated
 */
validate.type = function (field, data) {
  if (field.type instanceof DataType) {
    if (!field.type.isValid(data)) throw Error('Invalid type');
  } else if (field.type != typeof data) throw Error('Invalid type');
};

/**
 * Validates field with custom functions
 * @param field
 * @param data
 */

validate.custom = function (field, data) {
  if (!field || !field.validate)
    return ;

  /* iterates over validator functions */
  field.validate.forEach(function (func) {
    if (!func(data))
      throw Error('Custom validator failed');
  });
};

/*
 * Schema Prototype
 */
Schema.prototype.checkRequired = function (data) {
  for (var field in this.fields) {
    if (this.fields.hasOwnProperty(field)) {
      var required = this.fields[field].required === undefined || this.fields[field].required;
      if (required && (data[field] == null))
        throw Error('Missing field: ' + field);
    }
  }
};

Schema.prototype.validate = function (data, cb) {
  try {
    this.checkRequired(data);
    for (var field in data) {
      if (data.hasOwnProperty(field)) {
        validate.type(this.fields[field], data[field]);
        validate.custom(this.fields[field], data[field]);
      }
    }

    cb(null);
  } catch (err) {
    cb(err);
  }
};

/**
 * In node, returns undefined if call this.validate and
 * return boolean inside of callback
 * @param data
 * @returns {boolean}
 */

Schema.prototype.isValid = function (data) {
  try {
    this.checkRequired(data);
    for (var field in data) {
      if (data.hasOwnProperty(field)) {

        validate.type(this.fields[field], data[field]);
        validate.custom(this.fields[field], data[field]);
      }
    }

    return true;
  } catch (err) {
    return false;
  }
};

/**
 * May override existing attributes
 * @param data
 */
Schema.prototype.add = function (data) {
  for (var attr in data) {
    if (data.hasOwnProperty(attr))
      this.fields[attr] = data[attr];
  }
};

/**
 * transfers all attributes of previous schema to this one,
 * inheritance does not override existing attributes
 * @param schema
 */

Schema.prototype.inherits = function (schema) {
  for (var attr in schema.fields) {
    /* checks if field has not specified attribute */
    if (schema.fields.hasOwnProperty(attr) && (this.fields[attr] == null)) {
      this.fields[attr] = schema.fields[attr];
    }
  }
};

module.exports = Schema;
