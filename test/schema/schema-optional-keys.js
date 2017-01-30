var Schema = require('../../index').Schema;
var Field = Schema.Field;
var should = require('chai').should();

describe('Optional field keys', function () {

  describe.skip('default', function () {
    var animalSchema = new Schema({
      name: new Field({ type: String, default: 'dog' })
    });

    it('should populate field whether or not it is specified', function (done) {
      animalSchema.validate({ name: 'cat' }, function (err, animal) {
        if (err) return done(err);
        animal.name.should.equal('dog');
        animalSchema.isValid({}).should.equal(true);
        done();
      });
    });

    var dateSchema = new Schema({
      time: new Field({
        type: Number,
        default: Date.now
      })
    });

    it('should populate field by function invocation if value passed is a function', function (done) {
      dateSchema.validate({}, function (err, date) {
        if (err) return done(err);
        dateSchema.isValid({}).should.equal(true);
        done();
      });
    });
  });

});
