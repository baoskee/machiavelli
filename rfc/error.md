## Field.constrain

```javascript
var higherTen = Field.constrain(
    function (data) { return data > 10;}, 
    new Error('Data is smaller than ten'));

higherTen.validate(11, function (err) {
    if (err) 
        throw err;  /* Data is smaller than ten. */
    else
        console.log('Validation successful');
});
```
