var dateformat = require("dateformat");
    fields = require("./fields");

var AdiWriter = module.exports = function(contacts) {
    this.contacts = contacts;
    this.data = "";
};

AdiWriter.prototype.writeAll = function() {
    this.data += "# CloudShack ADIF export\n";
    this.writeField("adif_ver", "3.0.4");
    this.writeField("programid", "CloudShack");
    this.writeField("programversion", "1.0");
    this.data += "<EOH>\n\n";

    for (var i = 0; i < this.contacts.length; i++) {
        this.writeContact(this.contacts[i].value);
    }

    return this.data;
};

AdiWriter.prototype.writeFldigiLine = function() {
    if (!this.contacts) return "";

    var contact = this.contacts[0].value;
    for (key in contact) {
        this.writeProperty(key, contact[key]);
    }
    this.data += "<EOR>";

    return this.data;
}

AdiWriter.prototype.writeContact = function(contact) {
    for (key in contact) {
        this.writeProperty(key, contact[key]);
    }
    this.data += "<EOR>\n\n";
};

AdiWriter.prototype.writeProperty = function(key, value) {
    if (key == "_id") key = "app_cloudshack_id";
    else if (key == "_rev") key = "app_cloudshack_rev";
    else if (key == "start") {
        var date = new Date(value);
        this.writeField("qso_date", dateformat(date, "UTC:yyyymmdd"));
        this.writeField("time_on", dateformat(date, "UTC:HHMMss"));
        return;
    }
    else if (key == "end") {
        var date = new Date(value);
        this.writeField("qso_date_off", dateformat(date, "UTC:yyyymmdd"));
        this.writeField("time_off", dateformat(date, "UTC:HHMMss"));
        return;
    }

    if (!(key in fields)) {
        console.log("adif: unkown adif field", key);
        return;
    }

    var field = fields[key];
    var value = field.encode(value);

    this.writeField(key, value);
};

AdiWriter.prototype.writeField = function(key, value) {
    this.data += "<" + key.toUpperCase() + ":" + value.length + ">";
    this.data += value;
}

exports.AdiWriter = AdiWriter;
