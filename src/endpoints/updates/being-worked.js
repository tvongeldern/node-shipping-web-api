"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: [ "PUT", "POST" ],
	path: "/updates/being-worked",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validate_update(body) )
		.then( () => update_status(body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: "bw", detail: e }) );
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nobody"); }
		else if (requestBody.stop) { resolve(); }
		else { reject("nostop"); }
	});
}

function validate_update (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("updates/validate_being_worked", requestBody)
		.then(data => {
			if (!data) { reject("nodata"); }
			else if (!data.exists) { reject("nonexist"); }
			else { resolve(); }
		})
		.catch(e => reject([ "sql", "", e ]) );
	});
}

function update_status (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("updates/stop_being_worked", requestBody)
		.then( () => resolve() )
		.catch(e => reject([ "sql", "update", e ]) );
	});
}
