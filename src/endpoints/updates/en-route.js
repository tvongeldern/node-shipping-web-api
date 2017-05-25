"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: [ "PUT", "POST"],
	path: "/updates/en-route",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validate_en_route(body) )
		.then(first => en_route(body, first) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: "enrte", detail: e }) );
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nobody"); }
		else if (requestBody.stop) { resolve(); }
		else { reject("nostop"); }
	});
}

function validate_en_route (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("updates/validate_en_route", requestBody)
		.then(data => {
			if (!data) { reject("nodata"); }
			else if (!data.exists) { reject("nonexist"); }
			else {
				if (!data.not_first) { requestBody.first = true; }
				resolve();
			}
		})
		.catch(e => reject([ "sql", "valenrte", e ]) );
	});
}

function en_route (requestBody, first) {
	return new Promise((resolve, reject) => {
		mysql.query("updates/stop_en_route", requestBody)
		.then( () => resolve() )
		.catch(e => reject([ "sql", "enrte", e ]) );
	});
}
