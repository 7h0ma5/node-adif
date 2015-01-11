var libxml = require("libxmljs"),
    datetime = require("./datetime"),
    fields = require("./fields");

var AdxReader = module.exports = function(data) {
    try {
        this.doc = libxml.parseXmlString(data);
    }
    catch (err) {
        console.log(err);
        this.records = [];
        return;
    }

    this.record = this.doc.get("/ADX/RECORDS/RECORD");
};

AdxReader.prototype.readAll = function() {
    var contacts = [];

    while (true) {
        contact = this.readNext();
        if (!contact) break;
        contacts.push(contact);
    }

    return contacts;
};

AdxReader.prototype.readNext = function() {
    if (!this.record) return null;

    var contact = {};

    var recordFields = this.record.childNodes();

    for (var i = 0; i < recordFields.length; i++) {
        var recordField = recordFields[i];
        if (recordField.type() != "element") continue;

        var name = recordField.name();
        var value = recordField.text();

        if (!name || !value) continue;

        name = name.toLowerCase();

        if (name in fields) {
            var field = fields[name];
            value = field.decode(value);

            if (value) {
                contact[name] = value;
            }
        }
        else {
            console.log("adif: unknown adif field", name);
            continue;
        }
    }

    datetime.fixQsoDateTime(contact);

    this.record = this.record.nextElement();
    return contact;
}

exports.AdxReader = AdxReader;
