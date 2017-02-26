## Constraint
```javascript
var Constraint = Field.Constraint;
var higherTen = new Constraint(function (data) {
    return data > 10;
}, new Error('Data is smaller than ten'));

higherTen.validate(11, function (err) [
    if (err) 
        throw err;
    else 
        /* do something else */
});
```