var expect = require('chai').expect;
var Field = require('../index').Schema.Field;
var DataType = require('../index').DataType;

describe('Field', function () {

  describe('type:', function () {
    var strField = new Field({ type: String });
    var boolField = new Field({ type: Boolean });
    var numField = new Field({ type: Number });
    var typeError = 'Field input does not conform to data type';

    it('should pass if type correct', function (done) {
      numField.validateThrow(2);
      numField.validateThrow(new Number(1));
      boolField.validateThrow(false);
      boolField.validateThrow(new Boolean(true));
      strField.validateThrow('');
      strField.validateThrow(new String('hello'));
      done();
    });

    it('should fail if type incorrect', function (done) {
      expect(function () {numField.validateThrow('')}).to.throw(typeError);
      expect(function () {numField.validateThrow(true)}).to.throw(typeError);
      expect(function () {boolField.validateThrow(2)}).to.throw(typeError);
      expect(function () {boolField.validateThrow('')}).to.throw(typeError);
      expect(function () {strField.validateThrow(false)}).to.throw(typeError);
      expect(function () {strField.validateThrow(121)}).to.throw(typeError);
      done();
    });

    describe('custom data types', function () {
      var Animal = function (specie) { this.specie = specie };
      var animalField = new Field({ type: Animal });
      var integerField = new Field({ type: DataType.Integer });

      it('should work with native constructor functions', function (done) {
        animalField.validateThrow(new Animal('cat'));
        expect(function () {animalField.validateThrow(new Date())}).to.throw(typeError);
        done();
      });

      it('should work with DataType', function (done) {
        integerField.validateThrow(2);
        expect(function () {integerField.validateThrow(12.121)}).to.throw(typeError);
        done();
      });
    });
  });

  describe('required:', function () {
    it('should be true by default');
    describe('when false', function () {
      it('should not throw error if field not present');
      it('should still type validate if field present');
      it('should still custom validate if field present');
    });
  });

  describe('validate:', function () {
    it('should fail if one of validator function fails');
    it('should pass if all validator function passes');

    describe('custom validator object', function () {
      it('should fail with custom error message');
      it('should pass for correct case');
    });

  });

});
