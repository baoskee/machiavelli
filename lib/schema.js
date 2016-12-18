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
      var specValue = this.spec[key];
      if (specValue instanceof Field) {
        specValue.validateThrow(data[key]);
      } else {
        // recursively validates the Schema
        validateThrow.call({ spec: specValue }, data[key]);
      }
    }
  }
}

Schema.prototype.isValid = function (data) {
  try {
    validateThrow.call(this, data);
    return true;
  } catch (e) {
    return false;
  }
};

Schema.prototype.validate = function (data, cb) {
  try {
    validateThrow.call(this, data);
    cb(null);
  } catch (e) {
    cb(e);
  }
};

/**
 * May override existing fields.
 * @param data
 */
Schema.prototype.add = function (data) {
  for (var attr in data) {
    if (data.hasOwnProperty(attr))
      this.spec[attr] = data[attr];
  }
};

/**
 * transfers all attributes of previous schema to this one,
 * but does not transfer attributes already present
 * @param schema
 */

Schema.prototype.inherits = function (schema) {
  for (var attr in schema.spec) {
    /* checks if field has not specified attribute */
    if (schema.spec.hasOwnProperty(attr) && (this.spec[attr] == undefined)) {
      this.spec[attr] = schema.spec[attr];
    }
  }
};

Schema.Field = Field;

module.exports = Schema;
