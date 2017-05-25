"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: [ "PUT", "POST" ],
	path: "/updates/at-location",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validate_update(body) )
		.then( () => at_location(body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: "atloc", detail: e }) );
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
		mysql.query("updates/validate_at_location", requestBody)
		.then(data => {
			if (!data) { reject("nodata"); }
			else if (!data.exists) { reject("nonexist"); }
			else {
				if (data.first) { requestBody.first = true; }
				else if (data.last) { requestBody.last = true; }
				resolve();
			}
		})
		.catch(e => reject([ "sql", "updtval", e ]) );
	});
}

function at_location (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("updates/stop_at_location", requestBody)
		.then( () => resolve() )
		.catch(e => reject([ "sql", "updt", e ]) );
	});
}
