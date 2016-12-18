var assert = require('assert');
var Schema = require('../index').Schema;
var Field = Schema.Field;

describe('Schema', function () {
  const ErrorMessage = {
    TYPE: 'Invalid type',
    CUSTOM: 'Custom validator failed',
    MISSING: 'Missing field: ' /* with custom field name */
  };

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
      email: new Field({ type: String, required: true })
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
    userSchema.validate(valid_user, function (err) {
      assert.equal(err, null);
      assert(userSchema.isValid(valid_user));
      done();
    });
  });

  it('should fail if field is of wrong type', function (done) {
    userSchema.validate(wrong_type_user, function (err) {
      assert.notEqual(err, null);
      assert.equal(err.message, ErrorMessage.TYPE);
      assert(!userSchema.isValid(wrong_type_user));
      done();
    });
  });

  it('should fail if required field is missing', function (done) {
    userSchema.validate(missing_required_user, function (err) {
      assert.notEqual(err, null);
      assert.equal(err.message, ErrorMessage.MISSING + 'email');
      assert(!userSchema.isValid(missing_required_user));
      done();
    });
  });

  it('should pass if non-required field is not specified', function (done) {
    postingSchema.validate(no_description_posting, function (err) {
      assert.equal(err, null);
      assert(postingSchema.isValid(no_description_posting));
      done();
    });
  });

  it('should fail if custom function failed', function (done) {
    postingSchema.validate(negative_price_posting, function (err) {
      assert.notEqual(err, null);
      assert.equal(err.message, ErrorMessage.CUSTOM);
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

  it('should not override existing attributes in inheritance');
});

