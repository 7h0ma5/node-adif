var datetime = require("./datetime"),
    fields = require("./fields");

var AdiReader = module.exports = function(data) {
    this.data = data;
    this.pos = 0;
};

AdiReader.prototype.readAll = function() {
    var contacts = [];

    while (true) {
        contact = this.readNext();
        if (!contact) break;
        contacts.push(contact);
    }

    return contacts;
};

AdiReader.prototype.readNext = function() {
    var contact = {};

    while (true) {
        var field = this.readField();
        if (!field) return null;

        var name = field[0];
        var value = field[1];

        if (name in fields) {
            if (!value) continue;

            var field = fields[name];
            value = field.decode(value);

            if (value) {
                contact[name] = value;
            }
        }
        else if (name == "eor") {
            break;
        }
        else if (name == "eoh") {
            contact = {};
            continue;
        }
        else {
            console.log("adif: unknown adif field", name);
            continue;
        }
    }

    datetime.fixQsoDateTime(contact);

    return contact;
};

var PARSE_NIL = 0;
var PARSE_NAME = 1;
var PARSE_LENGTH = 2;
var PARSE_TYPE = 3;
var PARSE_VALUE = 4;

AdiReader.prototype.readField = function() {
    var state = PARSE_NIL;
    var fieldName = "", fieldLength = "",
        fieldType = "", fieldValue = "";

    for (; this.pos < this.data.length; this.pos++) {
        var c = this.data[this.pos];

        switch (state) {
        case PARSE_NIL:
            if (c === "<") state = PARSE_NAME;
            break;

        case PARSE_NAME:
            if (c === ":") {
                fieldName = fieldName.toLowerCase();
                state = PARSE_LENGTH;
            }
            else if (c === ">") {
                fieldName = fieldName.toLowerCase();
                return [fieldName, null];
            }
            else fieldName += c;
            break;

        case PARSE_LENGTH:
            if (c === ":") {
                fieldLength = parseInt(fieldLength, 10);
                state = PARSE_TYPE;
            }
            else if (c === ">") {
                fieldLength = parseInt(fieldLength, 10);
                state = PARSE_VALUE;
            }
            else fieldLength += c;
            break;

        case PARSE_TYPE:
            if (c === ">") state = PARSE_VALUE;
            else fieldType += c;
            break;

        case PARSE_VALUE:
            if (fieldLength > 0) {
                fieldLength--;
                fieldValue += c;
            }
            else return [fieldName, fieldValue];
            break;

        default:
            return null;
        }
    }

    return null;
};
