var Schema = require('../index').Schema;
var Field = Schema.Field;
var should = require('chai').should();

describe('Optional field keys', function () {

  describe('default', function () {
    var animalSchema = new Schema({
      name: new Field({ type: String, default: 'dog' })
    });

    it.skip('should populate field whether or not it is specified', function (done) {
      animalSchema.validate({ name: 'cat' }, function (err, animal) {
        if (err) return done(err);
        animal.name.should.equal('dog');
        animalSchema.isValid({}).should.equal(true);
        done();
      });
    });
  });

});
