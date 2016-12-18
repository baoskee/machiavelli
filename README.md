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
Don't be disheartened by all the constructors, they are there to 
modularize the logic and allow easy implementation of nested 
validation.

```javascript
var Schema = require('machiavelli').Schema
var Field = Schema.Field;
var postingSchema = new Schema({
    title: new Field({ type: String }),
    price: new Field({ type: Number }),
    description: new Field({ type: String, required: false })
});
```

### Synchronous validation
```javascript
var postingDocument = { title: 'Old windows mouse', price: 20 };
if (postingSchema.isValid(postingDocument)) {
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
    artist: new Field({ type: String })
});
ticketSchema.inherits(postingSchema);
```

### Extending schemas
A schema can be extended with new fields using the method addField() 
```javascript
ticketSchema.add({
    venue: new Field({ type: String, required: false }), 
    anotherField: new Field({ type: Number })
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
Simply define a function that returns true if object is of type data 
type, else returns false. Here we define a new DataType called 
Coordinate.

```javascript
DataType.Coordinate = new DataType(function (coord) {
    var longitude = coord[0];
    var latitude = coord[1];
    
    return (longitude >= -180 && longitude <= 180) && 
        (latitude >= -90 && latitude <= 90)
});
```

### Your own wrappers
If your data is already wrapped in your own constructor, there
is no need to define a new function. 

```javascript
var Animal = function (specie) { this.specie = specie }
var zooSchema = new Schema({ 
    animal: new Field({ type: Animal })
});
```

### Collection Validation (To be implemented)
DataType.isValidCollection() validates type on a collection level

```javascript
// TODO: Demonstrate example
```


## Optional keys
We have seen the the 'required' field, a boolean determining 
if Schema should fail if the field is not specified. Specifying the 
'required' field, unlike the 'type' field, is optional since the 
default is set to true. There are many other arguments we could use to
enhance our schema.

### validators - Custom validators
The argument to 'validate' should always be in an array, even if it
only contains one element. 

Functions specified under the validate argument should return a boolean
that specifies whether or not the data is valid. Custom validators can 
be made by the Validator constructor which takes in arguments isValid
as your validation function and error  as your error throwing object. 

```javascript
var isPositive = function (price) { return price >= 0; };
var Validator = Field.Validator;
var smallerThanTen = new Validator({ 
    isValid: function(price) { return price < 10 },
    error: new Error('Value not smaller than 10')
});

var coffeeSchema = new Schema({
    flavor: new Field({ type: String }),
    price: new Field({ 
        type: Number,
        validators: [isPostive, smallerThanTen] 
    });
});
```

### required - Default is true
Specify required to be false if you want the Schema to not require
the field in a document.

### Constructor tree
Accessing the constructors from the module. They are organized less
for accessibility than for logic. You will never need to use Validator
without using Field, and never Field without using Schema. As for 
DataType, I found it can be used without Schema.

```javascript
require('machivelli')
    .Schema
        .Field
            .Validator
    .DataType
```


## Philosophy
Why so many constructors? While JavaScript is a dynamically-typed 
language, it can be extremely beneficial to separate concerns by
using constructors as dependency injections. Hacking JavaScript
can be both fast AND reliable!
