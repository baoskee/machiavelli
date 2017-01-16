var Schema = require('../index').Schema;
var DataType = require('../index').DataType;
var Field = Schema.Field;
var should = require('chai').should();
var errorMessage = require('./util/errorMessage');

describe('Schema method', function () {

  describe('.capture', function () {
    var simpleSchema = new Schema({
      attributeOne: new Field({type: Number}),
      attributeTwo: new Field({type: String})
    });

    it('should return keys only in schema', function (done) {
      var captured = simpleSchema.capture({attributeOne: 123, attributeTwo: 'what', other: 'field'});
      captured.attributeOne.should.equal(123);
      captured.attributeTwo.should.equal('what');
      should.not.exist(captured.other);
      done();
    });

    var optionalSchema = new Schema({
      one: new Field({ type: Number, required: false }),
      two: new Field({ type: String, required: false })
    });
    describe('with optional fields', function () {
      it('should only return if they exist', function (done) {
        var captured = optionalSchema.capture({ two: 'hello' });
        captured.hasOwnProperty('one').should.equal(false);
        captured.two.should.equal('hello');
        done();
      });
    });

    describe('nested validation', function () {
      var bookSchema = new Schema({
        genre: new Field({type: String}),
        title: new Field({type: String}),
        author: {
          name: new Field({type: String}),
          origin: {
            country: new Field({ type: String }),
            city: new Field({ type: String })
          },
          age: new Field({type: DataType.Integer, required: false})
        }
      });

      it('should work with doubly nested', function (done) {
        var captured = bookSchema.capture({
          genre: 'Fiction',
          somethingElse: 'efg',
          title: 'For whom the bell tolls',
          author: {
            name: 'Ernest Hemingway',
            origin: {
              country: 'USA',
              city: 'Chicago'
            }
          }, something: 'abc'
        });
        captured.genre.should.equal('Fiction');
        captured.title.should.equal('For whom the bell tolls');
        captured.author.name.should.equal('Ernest Hemingway');
        captured.author.origin.country.should.equal('USA');
        captured.author.origin.city.should.equal('Chicago');
        should.not.exist(captured.something);
        should.not.exist(captured.somethingElse);
        should.not.exist(captured.age); // optional fields that are unspecified should not be included
        captured.author.hasOwnProperty('age').should.equal(false);
        done();
      });
      
    });
  });

});
