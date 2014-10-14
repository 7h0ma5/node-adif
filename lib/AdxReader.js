var libxml = require("libxmljs"),
    datetime = require("./datetime"),
    fields = require("./fields");

var AdxReader = module.exports = function(data) {
    this.data = data;
};

AdxReader.prototype.readAll = function() {
    try {
        this.doc = libxml.readXml(this.data);
    }
    catch (err) {
        return [];
    }

    var contacts = [];

    var records = doc.find("//record");
    for (var i = 0; i < records.length; i++) {
        contact = this.readRecord(records[i]);
        if (!contact) break;
        contacts.push(contact);
    }

    return contacts;
};

AdxReader.prototype.readRecord = function(record) {
    // todo
    return null;
}

exports.AdxReader = AdxReader;
