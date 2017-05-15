# The Data Pipeline
Pipelining field data allows for modular verification, formatting of data inputs from server requests,
and the formation of a concept of an abstract data type.

# InfoType
```javascript
var InfoType = function () {
  return this;
};

var Cat = new InfoType({});

var jerome = new Cat({});

var params = {};

jerome.process(params, function (err) {
  
});
```

Should be built at the field level. Allows constraints on fields to fail with custom errors.
```javascript
var Schema = require('../../index').Schema;
var animalSchema = new Schema({});

/* State parameters: Functional Programming. */
var params = {
  db: 'req.db', /* Database object. */
  res: 'res'    /* response object from Express. */
};

animalSchema.process(data, {}, function (err, animal) {
 
});
```

```javascript
var age = new Field({ type: Number });

/**
 * Part of the validation. 
 */
age.pipe(function (data, cb) {
   if (data < 18)
     return cb(new Error('You must be 18 or older.'));
   cb(null);
})
```
## Rollbacks
Operations/piped methods should have rollback methods associated with them, such that if one 
operation fails, it will try to rollback any changes. This allows atomic operations on a large
scale with operations to database.

```javascript
/* Enter syntax for a rollback operation. */
```
## Constraint
Constraints allow dynamic validation. 

```javascript
var DataType = require('../../index').DataType;
DataType.Email = new DataType(function (val) {
     /* Return true if is email, false otherwise. */
});

var email = new Field({ type: DataType.Email });

email.pipe(function (data, cb) {
  var self = this;
  self.params.db.collection('users').findOne({ email: data }, function (err, user) {
    if (user) /* User with email found. */
      return self.params.res.status(400).json({
        error: 'validation_error',
        description: 'Duplicate email: ' + data
      });
      
    cb(null, user);
  });
});
```

## Formatter
Separation of formatting subroutines allow modularity which means better code reuse and testability.

```javascript
var date = new Field({ type: String });

date.pipe(function (data, cb) {
  /* Format date string into a Date object. */
  var date = new Date(data);
  
  cb(null, date); /* This new processed date will be now in next stages of database. */
});
```

## Use in Express
```javascript
var api = require('express').Router();
var InfoType = require('');

var usernameField = new Field({ type: String });
usernameField.pipe(function (data, cb) {
  if (data.length > 20 || data.length < 1)
    return this.params.res.status(400).json({
      error: 'validation_error',
      description: 'Username must be between 1 and 20 characters.'
    });
  
  cb(null, data);
});

var User = new InfoType({
  username: usernameField
});

User.pipe(function (data, cb) {
  this.params.db.collection('users').insertOne(data, function (err, res) {
    if (err)
      return res.status(500).json({
        error: 'internal_server',
        description: 'Failed to save user to database.'
      });
    
    cb(null, data);
  });
});

User.pipe(function (data, cb) {
  
});

/**
* Figure how to pipe functions naturally into custom User methods.
*/
User.prototype.destroy = function (req, res) {
  
};

api.post('/v2/users', function (req, res, next) {
  var newUser = new User(req.body);
 
  newUser.process(req.body, function (err) {
    if (err)
      return res.status(500).json({
        error: 'internal_error',
        description: 'Abstract data failed.'
     });
   
    next();
 });
}, function (req, res, next) {
  
});
```
