"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: [ "PUT", "POST" ],
	path: "/updates/finished",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validate_finished(body) )
		.then( () => update_stop(body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: "fshd", detail: e}) );
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nobody"); }
		else if (requestBody.stop) { resolve(); }
		else { reject("nostop"); }
	});
}

function validate_finished (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("updates/validate_finished", requestBody)
		.then(data => {
			if (!data) { reject("nodata"); }
			else if (!data.exists) { reject("noexist"); }
			else {
				if (data.first) { requestBody.first = true; }
				else if (data.last) { requestBody.last = true; }
				resolve();
			}
		});
	});
}

function update_stop (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("updates/stop_finished", requestBody)
		.then( () => resolve() )
		.catch(e => reject([ "sql", "update", e ]) );
	});
}
