var adif = require("../index")
    assert = require("assert");

var testData = {
    "start": "1903-07-28T22:15:00.000Z",
    "end": "1903-07-29T01:45:43.000Z",
    "call": "AB0CD",
    "band": "20M",
    "freq": 14.253,
    "cqz": 14,
    "qso_random": true
};

describe(".adi Export", function() {
    var writtenData = null;
    var readData = null;

    it("should write .adi data", function() {
        var writer = new adif.AdiWriter("node-adif test", "1.0");
        writtenData = writer.writeAll([testData]);
        assert.equal(writtenData, writer.getData());
        assert(writtenData.length > 0);
    });

    it("should read the generated data", function() {
        var reader = new adif.AdiReader(writtenData);
        var data = reader.readAll();
        assert.equal(data.length, 1);
        readData = data[0];
    });

    it("should be the same as the written data", function() {
        assert.deepEqual(testData, readData);
    });

    it("should write a fldigi line", function() {
      var writer = new adif.AdiWriter("node-adif test", "1.0");
      writtenData = writer.writeFldigiLine(testData);
      assert(writtenData.length > 0);
    })

    it("should read the generated data", function() {
        var reader = new adif.AdiReader(writtenData);
        var data = reader.readAll();
        assert.equal(data.length, 1);
        readData = data[0];
    });

    it("should be the same as the written data", function() {
        assert.deepEqual(testData, readData);
    });
});
