'use strict';
const fs = require('fs');
const Promise = require('bluebird');
const connections = require('./connections.js');
const errors = require("./error_logging.js");
const constants = require("./constants.js");

function query_file (queryFile, dataObject, options) {
    return new Promise((resolve, reject) => {
        compileFile(queryFile, dataObject)
            .then(query => dbCall(query) )
            .then(data => resolve( cleanupResults(data, options) ) )
            .catch(err => reject(err) );
    });
}

function dbCall (query) {
    var cName = query.split(';').length > 2 ? 'db_multi' : 'db_single';
    var connection = connections[cName];
    return new Promise((resolve, reject) => {
        connection.query(query, (err, rows) => {
            if (!err) {
                resolve(rows);
            } else {
                console.log(err);
                errors.log(err);
                errors.log(query);
                reject({error: "dbconnection", detail: err});
            }
        });
    });
}

function compileFile (fileName, dataObject) {
    if (!fileName.match(/\./g)){
        fileName += '.sql';
    }
    var queryPath = './src/queries/' + fileName;
    return new Promise((resolve, reject) => {
        fs.readFile(queryPath, 'utf8', function (err, data){
            if (!err){
                resolve(compileText(data, dataObject));
            } else {
                errors.log(err);
                reject({error: "queryfileread"});
            }
        });
    });
};

function compileText (queryText, dataObject) {
    var constantsCompiled = compileConstants(queryText);
    var forsCompiled = compileForLoops(constantsCompiled, dataObject);
    var ifsCompiled = compileIfLogic(forsCompiled, dataObject);
    var variablesCompiled = compileVariables(ifsCompiled, dataObject);
    return cleanupQuery(variablesCompiled);
};

function compileVariables (queryText, dataObject) {
    return queryText.replace(/{{[ ]{0,2}([a-zA-Z0-9\.\_\-]*)[ ]{0,2}}}/g, (str, mch) => dataObject[mch]);
};

function compileIfLogic (queryText, dataObject) {
    return queryText.replace(/(\[[ ]{0,2}#if[ ]{0,2}([a-zA-Z0-9\.\_\$]*?)[ ]{0,2}])([\d\D\s]*?)(\[[ ]{0,2}\/if[ ]{0,2}\2[ ]{0,2}])/g, (str, mch) => {
        var varName = mch.replace(/\[[#\/]if[ ]{0,2}([a-zA-Z0-9\.\_\$]*?)[ ]{0,2}]/g, (str2, mch2) => mch2);
        return dataObject[varName] ? str.replace(/\[[#\/]if[ ]{0,2}[a-zA-Z0-9\.\_\$]*?[ ]{0,2}]/g, '') : '';
    });
};

function compileForLoops (queryText, dataObject) {
    var regex = /\[[ ]{0,2}#[ ]{0,2}for[ ]{0,4}([a-zA-Z0-9\_]*?)\]([\d\D\s]*?)\[[ ]{0,2}\/[ ]{0,2}\1[ ]{0,2}\]/g;
    return queryText.replace(regex, (str, mch) => {
        var arrayName = mch;
        var array = dataObject[arrayName];
        if (array && typeof array == 'object' && array[0]) {
            var loopTemplate = str.replace(regex, "$2");
            var loopOutput = '';
            var len = array.length;
            for (var i = 0; i < len; i++) {
                loopOutput += compileLoopIteration(loopTemplate, array[i]);
            }
            return loopOutput;
        } else {
            return "";
        }

    });
};

function compileLoopIteration (loopTemplate, loopIteration) {
    var regex = /\[([a-zA-Z0-9\_]*?)[ ]{0,2}\?[ ]{0,2}([\s\S]*?)\]/g;
    var loopVarRegex = /\[[ ]{0,2}([a-zA-Z0-9\_]*?)[ ]{0,2}\]/g;
    var varsCompiled = loopTemplate.replace(loopVarRegex, (str, mch) => {
        return loopIteration[mch] ? loopIteration[mch] : '';
    });
    var iteration = varsCompiled.replace(regex, (str, mch) => {
        var test = str.replace(regex, "$1");
        var op = str.replace(regex, "$2");
        return loopIteration[test] ? loopIteration[op] || op : '';
    });
    return iteration;
}

function compileConstants (queryText) {
    const regex = /<<[\s]*?([^\>\s]*?)[\s]*?>>/g;
    return queryText.replace(regex, (str, mch) => {
        var result = Object.assign({}, constants);
        let keys = mch.replace(regex, "$1").split(".");
        keys.forEach(key => {
            result = result[key];
        });
        return result;
    });
}

function cleanupQuery (queryText) {
    var cutLineBreaks = queryText.replace(/\n/g, ' ');
    var trimWhitespace = cutLineBreaks.replace(/([^\s]?)[\s]+([^\s]?)/g, "$1 $2");
    var removeTrailingCommas = trimWhitespace.replace(/([\,][\s]*?)+?([\)])/g, "$2");
    var removeLeadingCommas = removeTrailingCommas.replace(/([\(])([\s]*?[\,])/g, "$1");
    var removeConsecutiveCommas = removeLeadingCommas.replace(/(\,)[\s]*?\,[\s]*\,{0,1}/g, "$1");
    var removeTrailingAndOr = removeConsecutiveCommas.replace(/[\s]*(AND|OR)([\;\s]*$|[\s]*?\))/gi, "");
    return removeTrailingAndOr;
};

function cleanupResults (data, options) {
    let o = options || {};
    if (!data) { return {} }
    else if (o.responseIndex) { return data[o.responseIndex].insertId ? { insertId: data[o.responseIndex].insertId } : data[o.responseIndex] }
    else if (data.length == 1 && data[0] && typeof data[0].exists == 'number') { return data[0] }
    else if (data.affectedRows && data.insertId) {return { insertId: data.insertId } }
    else { return data };
}

exports.query = query_file;
