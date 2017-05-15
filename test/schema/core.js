var assert = require('assert');
var Schema = require('../../index').Schema;
var DataType = require('../../index').DataType;
var Field = Schema.Field;
var errorMessage = require('./../util/error-message');

describe('Schema', function () {

  /*
   * Test data
   */
  var valid_user = {
    username: 'baoser',
    password: 'foobar',
    email: 'baoser@berkeley.edu'
  }, wrong_type_user = {
    username: 4,
    password: Date.now(),
    email: 'baoser@berkeley.edu'
  }, missing_required_user = {
    username: 'baoser',
    password: 'foobar'
  };

  var no_description_posting = {
    title: 'Free puppies on Sproul',
    price: 0
  }, negative_price_posting = {
    title: 'Donald Trump',
    price: -10,
    description: 'Orange man wanting to be president.' +
    'Do not leave him alone with woman you love.'
  }, is_positive = function (price) {
    return price >= 0;
  };

  var valid_ticket = {
    title: "two tickets to Friday's Weezer concert",
    price: 20,
    artist: 'Weezer'
  };

  /*
   * A test case of a ticketing website
   */

  var userSchema, postingSchema, ticketSchema;
  before(function (done) {
    userSchema = new Schema({
      username: new Field({ type: String }),
      password: new Field({ type: String }),
      email: new Field({ type: String })
    });

    postingSchema = new Schema({
      title: new Field({ type: String }),
      price: new Field({ type: Number, validators: [is_positive] }),
      description: new Field({ type: String, required: false })
    });
    ticketSchema = new Schema({
      artist: new Field({ type: String })
    });
    ticketSchema.inherits(postingSchema);
    done();
  });

  it('should have two patterns of validation', function (done) {
    userSchema.validate(valid_user, function (err, user) {
      assert.equal(err, null);
      assert(userSchema.isValid(valid_user));
      user.username.should.equal(valid_user.username);
      user.email.should.equal(valid_user.email);
      user.password.should.equal(valid_user.password);
      done();
    });
  });

  it('should fail if field is of wrong type', function (done) {
    userSchema.validate(wrong_type_user, function (err) {
      assert.notEqual(err, null);
      assert.equal(err.message, errorMessage.TYPE);
      assert(!userSchema.isValid(wrong_type_user));
      done();
    });
  });

  it('should fail if required field is missing', function (done) {
    userSchema.validate(missing_required_user, function (err) {
      assert.notEqual(err, null);
      assert.equal(err.message, errorMessage.MISSING);
      assert(!userSchema.isValid(missing_required_user));
      done();
    });
  });

  it('should pass if non-required field is not specified', function (done) {
    postingSchema.validate(no_description_posting, function (err, posting) {
      assert.equal(err, null);
      assert(postingSchema.isValid(no_description_posting));
      posting.title.should.equal(no_description_posting.title);
      posting.price.should.equal(no_description_posting.price);
      posting.hasOwnProperty('description').should.equal(false);
      done();
    });
  });

  it('should fail if custom function failed', function (done) {
    postingSchema.validate(negative_price_posting, function (err) {
      assert.notEqual(err, null);
      assert.equal(err.message, errorMessage.CUSTOM);
      assert(!postingSchema.isValid(negative_price_posting));
      done();
    });
  });

  it('should be able to inherit another schema', function (done) {
    ticketSchema.validate(valid_ticket, function (err) {
      assert.equal(err, null);
      assert(!ticketSchema.isValid(no_description_posting));
      assert(!ticketSchema.isValid(negative_price_posting));
      assert(ticketSchema.isValid(valid_ticket));
      done();
    });
  });

  it('should not override existing attributes in inheritance', function (done) {
    var number = new Schema({ value: new Field({ type: Number }) });
    var string = new Schema({ value: new Field({ type: String }) });
    number.inherits(string);
    number.isValid({ value: 200 }).should.equal(true);
    number.isValid({ value: 'poop' }).should.equal(false);
    string.isValid({ value: 'hello' }).should.equal(true);
    done();
  });

  it('should allow nested schemas', function (done) {
    var passSchema = new Schema({
      firstUser: userSchema,
      secondUser: userSchema
    });

    passSchema.isValid({ firstUser: valid_user, secondUser: missing_required_user }).should.equal(false);
    passSchema.validate({ firstUser: valid_user, secondUser: valid_user }, function (err, pass) {
      if (err) return done(err);
      pass.firstUser.username.should.equal(valid_user.username);
      pass.secondUser.username.should.equal(valid_user.username);
      done();
    });
  });

  describe('using nested validation', function () {
    var animalSchema = new Schema({
      specie: new Field({type: DataType.String}),
      habitats: new Field({type: DataType.Array /* , validators: [DataType.String.collectionIsValid] */ }),
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

    // Not working
    it.skip('using collectionIsValid should use isValid for every member', function (done) {
      cat.habitats.push(3); // false member
      animalSchema.validate(cat, function (err) {
        err.message.should.equal(errorMessage.CUSTOM);

        animalSchema.isValid(cat).should.equal(false);
        done();
      });
    });

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
});

