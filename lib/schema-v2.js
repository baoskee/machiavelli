var Field = require('./util/field');

var Schema = function (spec) {
  this.spec = spec;
  return this;
};

/**
 * Function that parses schema and throws if there is an error.
 * @param data
 */
function validateThrow(data) {
  for (var key in this.spec) {
    if (this.spec.hasOwnProperty(key)) {
      // this.spec[key] might be an object of more fields
      var inner = this.spec[key];
      if (inner instanceof Field) {
        inner.validate(data);
      } else {
        validateThrow(inner);
      }
    }
  }
}

Schema.prototype.isValid = function (data) {
  try {
    validateThrow(data);
    return true;
  } catch (e) {
    return false;
  }
};

Schema.prototype.validate = function (data, cb) {
  try {
    validateThrow(data);
    cb(null);
  } catch (e) {
    return false;
  }
};

/**
 * May override existing fields.
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
 * but does not transfer attributes already present
 * @param schema
 */

Schema.prototype.inherits = function (schema) {
  for (var attr in schema.fields) {
    /* checks if field has not specified attribute */
    if (schema.fields.hasOwnProperty(attr) && (this.fields[attr] == undefined)) {
      this.fields[attr] = schema.fields[attr];
    }
  }
};

Schema.Field = Field;

module.exports = Schema;