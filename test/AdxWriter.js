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

describe(".adx Export", function() {
    it("should write .adx data", function() {
        var writer = new adif.AdxWriter([{"value": testData}]);
        writtenData = writer.writeAll();
        assert(writtenData.length > 0);
    });
});
