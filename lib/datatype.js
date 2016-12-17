var DataType = function (definition) {
  this.definition = definition;
};

DataType.String = new DataType(function (val) {
  return typeof val === 'string';
});

DataType.Function = new DataType(function (val) {
  return typeof val === 'function';
});

DataType.Integer = new DataType(function (val) {
  return (typeof val === 'number') &&  val - Math.round(val) == 0;
});

DataType.Double = new DataType(function (val) {
  return typeof val === 'number';
});

DataType.Date = new DataType(function (val) {
  return Object.prototype.toString.call(val) === '[object Date]'
});

DataType.Boolean = new DataType(function (val) {
  return typeof val === 'boolean';
});
