# machiavelli
[![Build Status](https://travis-ci.org/baoskee/machiavelli.svg?branch=master)](https://travis-ci.org/baoskee/machiavelli)
[![codecov](https://codecov.io/gh/baoskee/machiavelli/branch/master/graph/badge.svg)](https://codecov.io/gh/baoskee/machiavelli)

Lightweight application-level schema for Javascript models.


## Why not Mongoose or another ORM
ORMs don't cover completely the features that the Official Node.js 
Driver have. Many ORMs, Mongoose in particular, are slow vs. the 
official driver and are more prone to bugs.

This module is made for those who are frustrated by reading two docs 
to communicate with one database. By separating the Schema from the 
ORM, we are adhering to the Node.js philosophy of modularization.

## Getting Started

```javascript
var Schema = require('machiavelli').Schema
var postingSchema = new Schema({
    title: { type: 'string', required: true },
    price: { type: 'number', required: true },
    description: { type: 'string' }
});
```

### Synchronous validation
```javascript
var posting = { title: 'Old windows mouse', price: 20 };
if (postingSchema.isValid(posting)) {
    /* save posting to database */
} else {
    /* handle error */ 
}
```

### Asynchronous validation
```javascript
postingSchema.validate(posting, function (err) {
    if (err) {
        /* handle error */
    } else {
        /* save posting to database */
    }
});
```

### Custom validators 
```javascript
var is_positive = function (price) { return price >= 0; };
var coffeeSchema = new Schema({
    flavor: { type: 'string', required: true },
    price: { type: 'number', required: true, validate: [is_positive] }
});
```

### Schema inheritance
The inherits method need to be declared after schema declaration. 
Will not overwrite existing fields, but will inherit validation 
requirements of other fields.

```javascript
var ticketSchema = new Schema({ 
    artist: { type: 'string', required: true }
});
ticketSchema.inherits(postingSchema);
```


## Why use a Schema at all
Light-weight schemas can provide another protection layer for malicious
database injections.

## Using Schema in Express middleware for modularizing logic
```javascript
var app = require('express')();
var authenticationSchema = new Schema({
  username: { type: 'string', required: true },
  password: { type: 'string', required: true }
});

/*
 * Middleware to check validity of input,
 * allow customization of error message and
 * status code for each type of failure
 */ 
 
app.use(function (err, req, res, next) {
  authenticationSchema.validate({ 
    username: req.body.username,
    password: req.body.password
  }, function (err) {
    if (err) return res.status(401).json({
      type: 'validation_error',
      message: err
    });

    next();
  });
});
```

## Future contribution ideas
1. More specific types, like Date, Integer.
2. More tests, please.
3. Custom error messages for custom validator functions.
4. Custom error messages for required validation.
5. Custom error messages for type validation.
