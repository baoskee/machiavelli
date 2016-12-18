var DataType = require('../index').DataType;
var Schema = require('../index').Schema;
var Field = Schema.Field;
var should = require('chai').should();
var errorMessage = require('./util/errorMessage');

describe('DataType specs', function () {

  describe('using data types with Schema', function () {
    var animalSchema = new Schema({
      // specie: new Field({type: DataType.String})
      habitats: new Field({type: DataType.Array /* validators: [DataType.String.collectionIsValid] */ }),
      stats: {
        avgWeight: new Field({type: DataType.Double, required: false }),
        avgLifeSpan: new Field({type: DataType.Integer})
      }
    });

    var cat;
    beforeEach(function (done) {
      /* confirms correctly to animalSchema */
      cat = {
        specie: 'feline',
        habitats: ['jungle','house'],
        stats: {
          avgWeight: 20,
          avgLifeSpan: 10
        }
      };
      done();
    });

    // it('using collectionIsValid should use isValid for every member', function (done) {
    //   cat.habitats.push(3); // false member
    //   animalSchema.validate(cat, function (err) {
    //     err.message.should.equal(errorMessage.CUSTOM);
    //
    //     animalSchema.isValid(cat).should.equal(false);
    //     done();
    //   });
    // });

    it('should not fail if required is set to false and field does not exist');

    describe('nested values validation should', function () {
      it('verify avgLifeSpan correctly', function (done) {
        animalSchema.validate(cat, function (err) {
          if (err) throw err;

          animalSchema.isValid(cat).should.equal(true);
          done();
        });
      });

      it('verify type correctly', function (done) {
        cat.stats.avgLifeSpan = 'wrongType';
        animalSchema.validate(cat, function (err) {
          err.message.should.equal(errorMessage.TYPE);

          animalSchema.isValid(cat).should.equal(false);
          done();
        });
      });
    });

  });

  describe('Defining custom data types', function () {
    DataType.Coordinate = new DataType(function (coord) {
      var longitude = coord[0];
      var latitude = coord[1];

      return (longitude >= -180 && longitude <= 180) &&
        (latitude >= -90 && latitude <= 90)
    });

    it('Coordinate should pass', function (done) {
      var coord = DataType.Coordinate;
      coord.isValid([-12.23, 12.12]).should.equal(true);
      coord.isValid([0]).should.equal(false);
      coord.isValid([-200, 12.12]).should.equal(false);
      done();
    });
  });

  describe('Built-in DataType', function () {
    it('.String should pass', function (done) {
      var strn = DataType.String;
      strn.isValid('hello').should.equal(true);
      strn.isValid(new String('hello')).should.equal(true);
      strn.isValid(2).should.equal(false);
      done();
    });
    
    it('.Function should pass', function (done) {
      var func = DataType.Function;
      func.isValid(new Function('a', 'b', 'return a + b')).should.equal(true);
      func.isValid(function () {}).should.equal(true);
      func.isValid({}).should.equal(false);
      done();
    });

    it('.Integer should pass', function (done) {
      var int = DataType.Integer;
      int.isValid(new Number(1)).should.equal(true);
      int.isValid(20).should.equal(true);
      int.isValid(0).should.equal(true);
      int.isValid(0.231).should.equal(false);
      int.isValid(-40.1).should.equal(false);
      int.isValid(7.0001).should.equal(false);
      done();
    });

    it('.Double should pass', function (done) {
      var doub = DataType.Double;
      doub.isValid(2.123).should.equal(true);
      doub.isValid(-122).should.equal(true);
      doub.isValid(0).should.equal(true);
      doub.isValid('').should.equal(false);
      done();
    });

    it('.Date should pass', function (done) {
      var date = DataType.Date;
      date.isValid(new Date()).should.equal(true);
      date.isValid(Date.now()).should.equal(false);
      done();
    });

    it('.Boolean should pass', function (done) {
      var bool = DataType.Boolean;
      bool.isValid(new Boolean(true)).should.equal(true);
      bool.isValid(false).should.equal(true);
      done();
    });

    it('.Array', function (done) {
      var arr = DataType.Array;
      arr.isValid(new Array(10)).should.equal(true);
      arr.isValid([]).should.equal(true);
      arr.isValid(0).should.equal(false);
      done();
    });
  });


});
