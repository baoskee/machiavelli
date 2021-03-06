var DataType = function (definition) {
  this.definition = definition;
};

DataType.String = new DataType(function (val) {
  return val.constructor === String;
});

DataType.Function = new DataType(function (val) {
  return val instanceof Function;
});

DataType.Integer = new DataType(function (val) {
  return val.constructor === Number &&  val - Math.round(val) == 0;
});

DataType.Double = new DataType(function (val) {
  return val.constructor === Number;
});

DataType.Date = new DataType(function (val) {
  return val.constructor === Date;
});

DataType.Boolean = new DataType(function (val) {
  return val.constructor === Boolean;
});

DataType.Array = new DataType(function (val) {
  return val instanceof Array;
});

DataType.prototype.isValid = function (val) {
  return this.definition(val);
};

/**
 * DEPRECATED. There exists a bug :/
 * @param collection
 * @returns {boolean}
 */
DataType.prototype.isValidCollection = function (collection) {
  for (var i = 0; i < collection.length; i++) {
    if (!this.isValid(collection[i])) { return false; }
  }
  return true;
};

module.exports = DataType;
