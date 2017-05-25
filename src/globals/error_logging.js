"use strict";
const fs = require("fs");
const errorLog = "./errorLog.txt";


function error_log (str, title) {
    if (title) { fs.appendFileSync(errorLog, (" **** " + title + "\n")); }
    var now = new Date().toString() + " : ";
    fs.appendFileSync(errorLog, now);
    fs.appendFileSync(errorLog, str);
    fs.appendFileSync(errorLog, "\n\n");
}

function overwrite_log (str, title) {
    if (title) {
        fs.writeFileSync(errorLog, (" **** " + title + "\n"));
        fs.appendFileSync(errorLog, str);
    } else {
        fs.writeFileSync(errorLog, str);
    }

}

function clear_log () {
    fs.writeFileSync(errorLog, "** Log was cleared **\n\n");
}

exports.log = error_log;
exports.overwrite = overwrite_log;
exports.clear = clear_log;
