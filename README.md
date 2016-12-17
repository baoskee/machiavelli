# machiavelli
[![Build Status](https://travis-ci.org/baoskee/machiavelli.svg?branch=master)](https://travis-ci.org/baoskee/machiavelli)
[![codecov](https://codecov.io/gh/baoskee/machiavelli/branch/master/graph/badge.svg)](https://codecov.io/gh/baoskee/machiavelli)

Lightweight application-level schema for Javascript models.


## Why not Mongoose or another ORM
ORMs don't cover completely the features that the official drivers 
have. Furthermore, ORMs are notorious for being slow compared to 
official drivers, and tend to be irregularly maintained as time
goes on to be more prone to bugs.

This module is made for those who are frustrated by reading two docs 
to communicate with one database. Having a separate Schema from built-in
database schemas can be advantageous; data can be validated  directly 
from your application instead of unnecessarily over network requests.

## Getting Started

```javascript
var Schema = require('machiavelli').Schema
var Field = Schema.Field;
var postingSchema = new Schema({
    title: new Field({ type: 'string', required: true }),
    price: new Field({ type: 'number', required: true }),
    description: new Field({ type: 'string' })s
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

### Schema inheritance
The inherits method need to be declared after schema declaration. 
Will not overwrite existing fields, but will inherit validation 
requirements of other fields.

```javascript
var ticketSchema = new Schema({ 
    artist: new Field({ type: 'string' })
});
ticketSchema.inherits(postingSchema);
```

### Extending schemas
A schema can be extended with new fields using the method addField() 
```javascript
ticketSchema.addField({
    venue: new Field({ type: 'string', required: false }), 
    anotherField: new Field({ type: 'number' })
});
```

### Why use a Schema at all
Light-weight schemas can provide another protection layer for malicious
database injections.

## Using DataType
Required is now true by default. 

```javascript
var DataType = require('machiavelli').DataType;
var ticketSchema = new Schema({
    _id: new Field({ type: DataType.ObjectID }),
    title: new Field({ type: DataType.String }), 
    price: new Field({ type: DataType.Integer, required: false }), 
    createdAt: new Field({ type: DataType.Date}),
    owner: {
        _id: new Field({ type: DataType.ObjectID }),
        username: new Field({ type: DataType.String })
    }
});
```


### Machiavelli-Defined Types
* Function
* String
* Integer
* Double
* Date
* Boolean
* Array

### Defining new data types
Defining new dataType from MongoDB's ObjectID. Simply define a function
that returns true if object is of type data type, else returns false.

```javascript
var ObjectID = require('mongodb').ObjectID;
DataType.ObjectID = new DataType(function (val) {
    return val instanceof ObjectID;
}); 
```

Here we define a new DataType called Coordinate.
```javascript
DataType.Coordinate = new DataType(function (coord) {
    var longitude = coord[0];
    var latitude = coord[1];
    
    return (longitude >= -180 && longitude <= 180) && 
        (latitude >= -90 && latitude <= 90)
});
```

## Error Types (To be implemented)
The Schema comes with flexible error messages, customizable from
the structure of the error object, to the error returned at
each stage of the Schema verification process.

```javascript 
var ErrorType = require('machievelli').ErrorType;
```

## Optional arguments
We have seen the the 'required' field, a boolean determining 
if Schema should fail if the field is not specified. Specifying the 
'required' field, unlike the 'type' field, is optional since the 
default is set to true. There are many other arguments we could use to
enhance our schema.

### validate - Custom validators 
Functions specified under the validate argument should return a boolean
that specifies whether or not the data is valid. Custom validators can 
be objects of form { validator: Function, message: String } instead of 
functions.

```javascript
var isPositive = function (price) { return price >= 0; };
var smallerThanTen = new Validator({ 
    validator: function(price) { return price < 10 },
    message: 'Value not smaller than 10'
});

var coffeeSchema = new Schema({
    flavor: new Field({ type: 'string', required: true }),
    price: new Field({ 
        type: new Field('number', required: true), 
        validate: [isPostive, smallerThanTen] 
    });
});
```

## Future contribution ideas
1. Validation of nested objects.
2. More flexible data types, and creating new data types.
3. Custom error messages.
