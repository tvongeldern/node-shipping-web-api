'use strict';
const Hapi = require("hapi");
const server = new Hapi.Server();

const port = 8080;

exports.init = server.connection({ port });

exports.start = () => server.start((err)=>{
    if (err){
        throw err;
    } else {
        console.log("\nServer running on port", port);
    }

});

exports.instance = server;
