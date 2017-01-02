var Schema = require('../index').Schema;
var DataType = require('../index').DataType;
var Field = Schema.Field;
var should = require('chai').should();
var errorMessage = require('./util/errorMessage');
var ObjectID = require('mongodb').ObjectID;

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
