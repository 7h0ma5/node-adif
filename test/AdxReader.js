var adif = require("../index")
    assert = require("assert");

var testData = '<?xml version="1.0" encoding="UTF-8"?>\n'
             + "<ADX>\n"
             + "  <HEADER>\n"
             + "    <ADIF_VER>3.0</ADIF_VER>\n"
             + "    <PROGRAMID>node-adif test</PROGRAMID>\n"
             + "    <PROGRAMVERSION>1.0</PROGRAMVERSION>\n"
             + "  </HEADER>\n"
             + "  <RECORDS>\n"
             + "    <RECORD>\n"
             + "      <CALL>AB3CD</CALL>\n"
             + "      <QSO_DATE>19030728</QSO_DATE>\n"
             + "      <TIME_ON>2215</TIME_ON>\n"
             + "      <QSO_DATE_OFF>19030729</QSO_DATE_OFF>\n"
             + "      <TIME_OFF>014543</TIME_OFF>\n"
             + "      <CQZ>14</CQZ>\n"
             + "      <QSO_RANDOM>Y</QSO_RANDOM>\n"
             + "      <BAND>40M</BAND>\n"
             + "    </RECORD>\n"
             + "  </RECORDS>\n"
             + "</ADX>\n";

describe(".adx Import", function() {

    var record = null;

    it("should read an .adx file", function() {
        var reader = new adif.AdxReader(testData);
        var records = reader.readAll();
        assert.equal(records.length, 1);
        record = records[0];
    });

    it("should parse the callsign (string)", function() {
        assert.equal(record.call, "AB3CD");
    });

    it("should parse the start date and time (datetime)", function() {
        assert.equal(record.start, "1903-07-28T22:15:00.000Z");
    });

    it("should parse the end date and time (datetime)", function() {
        assert.equal(record.end, "1903-07-29T01:45:43.000Z");
    });

    it("should parse the cq zone (number)", function() {
        assert.equal(record.cqz, 14);
    });

    it("should parse the qso random field (boolean)", function() {
        assert.equal(record.qso_random, true);
    });

    it("should parse the band (enum)", function() {
        assert.equal(record.band, "40M");
    })
});
