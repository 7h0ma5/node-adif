# node-adif

  [![NPM Version](https://img.shields.io/npm/v/adif.svg?style=flat)](https://www.npmjs.org/package/adif)
  [![Build Status](https://img.shields.io/travis/7h0ma5/node-adif.svg?style=flat)](https://travis-ci.org/7h0ma5/node-adif)
  [![Coverage](https://img.shields.io/coveralls/7h0ma5/node-adif.svg?style=flat)](https://coveralls.io/r/7h0ma5/node-adif)

## Examples

### Write .adi and .adx data

```javascript
var adif = require("adif");

var contact = {
  "call": "AB0CDE",
  "freq": 14.245,
  "mode": "SSB"
  "start": "2014-05-29T23:55:20.000Z",
  "end": "2014-05-30T00:07:43.000Z"
};

// Generate .adi data
var adiWriter = new adif.AdiWriter("MyAppName", "1.0");
var adiData = adiWriter.writeAll([contact]);

// Generate .adx data
var adxWriter = new adif.AdxWriter("MyAppName", "1.0");
var adxData = adxWriter.writeAll([contact]);
```

### Read .adi and .adx data

```javascript
var adif = require("adif");

// Read .adi data
var adiData = "<CALL:6>AB0CDE<FREQ:6>14.245<MODE:3>SSB ...";
var adiReader = new adif.AdiReader(adiData);
var contacts = adiReader.readAll();

// Generate .adx data
var adxData = "<ADX><RECORDS><RECORD><CALL>AB0CDE</CALL> ... </RECORD></RECORDS></ADX>";
var adxReader = new adif.AdxReader(adiData);
var contacts = adxReader.readAll();
```
