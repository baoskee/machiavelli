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
          age: new Field({type: DataType.Integer, required: false})
        }
      });
      var commentSchema = new Schema({
        posting: {
          _id: new Field({ type: ObjectID }),
          title: new Field({ type: String }),
          subtitle: new Field({ type: String }),
          owner: {
            _id: new Field({ type: ObjectID }),
            username: new Field({ type: String })
          }
        },
        text: new Field({ type: String })
      });

      it('should work with doubly nested', function (done) {
        var captured = bookSchema.capture({
          genre: 'Fiction',
          somethingElse: 'efg',
          title: 'For whom the bell tolls',
          author: {
            name: 'Ernest Hemingway'
          }, something: 'abc'
        });
        captured.genre.should.equal('Fiction');
        captured.title.should.equal('For whom the bell tolls');
        captured.author.name.should.equal('Ernest Hemingway');
        should.not.exist(captured.something);
        should.not.exist(captured.somethingElse);
        should.not.exist(captured.age); // optional fields that are unspecified should not be included
        captured.author.hasOwnProperty('age').should.equal(false);
        done();
      });

      it('should work with triply nested schema', function (done) {
        var newComment = {
          owner: {
            _id: new ObjectID(),
            username: 'ratatouille'
          }, posting: { _id: new ObjectID(), title: 'hello', subtitle: 'world', owner: { _id: new ObjectID(), username: 'poopball'}},
          text: 'asdfasdfasdfasdf ',
          createdAt: Date.now(),
          numVotes: 0
        };
        commentSchema.validate(newComment, function (err, comment) {
          if (err) return done(err);
          done();
        });

      });

    });
  });

});
