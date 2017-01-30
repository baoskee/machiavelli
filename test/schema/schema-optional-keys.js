var Schema = require('../../index').Schema;
var Field = Schema.Field;
var should = require('chai').should();

describe('Optional field keys', function () {

  describe('default', function () {
    var animalSchema = new Schema({
      name: new Field({ type: String, default: 'dog' })
    });

    it('should populate field whether or not it is specified', function (done) {
      animalSchema.validate({}, function (err, animal) {
        if (err) return done(err);
        animal.name.should.equal('dog');
        animalSchema.isValid({}).should.equal(true);
        done();
      });
    });

    var dateSchema = new Schema({
      time: new Field({
        type: Number,
        default: Math.random
      })
    });

    it('should populate field by function invocation if value passed is a function', function (done) {
      var _date;
      dateSchema.validate({}, function (err, date) {
        if (err) return done(err);
        _date = date;
        should.exist(_date);
        dateSchema.isValid({}).should.equal(true);
        dateSchema.validate({}, function (err, date) {
          if (err) return done(err);
          _date.should.not.equal(date);
          should.exist(date);
          done();
        });
      });
    });
  });

});
