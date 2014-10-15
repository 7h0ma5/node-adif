var dateformat = require("dateformat");
    fields = require("./fields");

var AdiWriter = module.exports = function(programid, programversion) {
    this.data = "# node-adif export\n";
    this.writeField("adif_ver", "3.0.4");
    this.writeField("programid", programid || "node-adif");
    if (programversion) this.writeField("programversion", programversion);
    this.data += "<EOH>\n\n";
};

AdiWriter.prototype.getData = function() {
    return this.data;
}

AdiWriter.prototype.writeAll = function(contacts) {
    for (var i = 0; i < contacts.length; i++) {
        this.writeContact(contacts[i]);
    }

    return this.data;
};

AdiWriter.prototype.writeFldigiLine = function(contact) {
    this.data = "";

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
