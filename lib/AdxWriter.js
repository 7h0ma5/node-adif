var dateformat = require("dateformat"),
    libxml = require("libxmljs"),
    fields = require("./fields");

var AdxWriter = module.exports = function(contacts) {
    this.contacts = contacts;
    this.doc = new libxml.Document();

    var adx = this.doc.node("ADX");
    var header = adx.node("HEADER");

    header.node("ADIF_VER", "3.0.4");
    header.node("PROGRAMID", "CloudShack");
    header.node("PROGRAMVERSION", "1.0");

    this.records = adx.node("RECORDS");
};

AdxWriter.prototype.writeAll = function() {
    for (var i = 0; i < this.contacts.length; i++) {
        this.writeContact(this.contacts[i].value);
    }
    return this.doc.toString(true);
}

AdxWriter.prototype.writeContact = function(contact) {
    var record = this.records.node("RECORD");
    for (key in contact) {
        this.writeProperty(record, key, contact[key]);
    }
}

AdxWriter.prototype.writeProperty = function(record, key, value) {
    if (key == "_id") {
        var attr = {PROGRAMID: "CloudShack", FIELDNAME: "_id", TYPE: "S"};
        record.node("APP").attr(attr).text(value);
        return;
    }
    else if (key == "_rev") {
        var attr = {PROGRAMID: "CloudShack", FIELDNAME: "_rev", TYPE: "S"};
        record.node("APP").attr(attr).text(value);
        return;
    }
    else if (key == "start") {
        var date = new Date(value);
        record.node("QSO_DATE", dateformat(date, "UTC:yyyymmdd"));
        record.node("TIME_ON", dateformat(date, "UTC:HHMMss"));
        return;
    }
    else if (key == "end") {
        var date = new Date(value);
        record.node("QSO_DATE_OFF", dateformat(date, "UTC:yyyymmdd"));
        record.node("TIME_OFF", dateformat(date, "UTC:HHMMss"));
        return;
    }

    if (!(key in fields)) {
        console.log("unkown adif field", key);
        return;
    }

    var field = fields[key];
    var value = field.encode(value);

    record.node(key.toUpperCase(), value);
};
