function readDate(date, dateObj) {
    var year = 0, month = 0, day = 0;

    if (date && date.length == 8) {
        year = parseInt(date.substring(0, 4), 10);
        month = parseInt(date.substring(4, 6), 10);
        day = parseInt(date.substring(6, 8), 10);
    }

    dateObj.setUTCFullYear(year, month-1, day);

    return dateObj;
}

function readTime(time, dateObj) {
    var hour = 0, minute = 0, second = 0;

    if (time && time.length >= 4) {
        hour = parseInt(time.substring(0, 2), 10);
        minute = parseInt(time.substring(2, 4), 10);
    }
    if (time && time.length >= 6) {
        second = parseInt(time.substring(4, 6), 10);
    }

    dateObj.setUTCHours(hour, minute, second, 0);

    return dateObj;
}

function fixQsoDateTime(contact) {
    var start = new Date();
    var end = new Date();

    var start_date = contact["qso_date"];
    readDate(start_date, start);

    var end_date = contact["qso_date_off"];
    if (!end_date) end_date = start_date;
    readDate(end_date, end);

    var time_on = contact["time_on"];
    readTime(time_on, start);

    var time_off = contact["time_off"];
    if (!time_off) time_off = time_on;
    readTime(time_off, end);

    delete contact["qso_date"];
    delete contact["qso_date_off"];
    delete contact["time_on"];
    delete contact["time_off"];

    contact["start"] = start.toJSON();
    contact["end"] = end.toJSON();
};

exports.fixQsoDateTime = fixQsoDateTime;
exports.readDate = readDate;
exports.readTime = readTime;
