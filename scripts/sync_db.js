"use strict";

//const mysql = require("mysql");
const fs = require("fs");
const Promise = require("bluebird");
const connection = require("../src/globals/connections.js").db_single;
const exec = require("child_process").exec;

const tables_dir = "./src/tables";

var tables = [];
var promises = [];
var statements = [];

clearTablesDir()
.then( () => getTables() )
.then( () => getCreateStatements() )
.then( () => writeTableFiles() )
.then( () => { console.log("\nSYNCED!\n"); process.exit(); } )
.catch(e => console.log(e) );

function clearTablesDir () {
    let command = "rm -f " + tables_dir + "/*";
    return new Promise((resolve, reject) => {
        exec(command, (err, stout, sterr) => {
            if (!err) { resolve(); }
            else { reject("clearTablesDir :\n\n", err); }
        });
    });
}


function getTables () {
    return new Promise((resolve, reject) => {
        connection.query("SHOW TABLES", (err, rows) => {
            if (!err && rows) {
                let len = rows.length;
                for (let i = 0; i < len; i++) {
                    if (rows[i] && rows[i]["Tables_in_freight"]) {
                        tables.push(rows[i]["Tables_in_freight"]);
                    }
                }
                resolve();
            }
            else { reject("getTables :\n\n", err); }
        });
    });
}

function getTableInfo (tableName) {
    let query = "SHOW CREATE TABLE `" + tableName + "`;";
    return new Promise((resolve, reject) => {
        connection.query(query, (err, rows) => {
            if (!err) { resolve(rows); }
            else { reject("getTableInfo :\n\n", err); }
        });
    });
}

function getCreateStatements () {
    tables.forEach(table => promises.push(getTableInfo(table)) );
    return new Promise((resolve, reject) => {
        Promise.all(promises)
            .then(data => {
                data.forEach(packet => {
                    if (packet && packet[0] && packet[0]["Table"] && packet[0]["Create Table"]) {
                        statements.push({ table: packet[0]["Table"], statement: packet[0]["Create Table"] });
                    }
                });
                resolve();
            })
            .catch(e => reject("getCreateStatements :\n\n", e) );
    });
}

function writeTableFiles () {
    return new Promise((resolve, reject) => {
        statements.forEach(packet => {
            let fileName = tables_dir + "/" + packet.table + ".sql";
            exec("touch " + fileName);
            fs.writeFileSync(fileName, packet.statement);
        });
        resolve();
    });
}
