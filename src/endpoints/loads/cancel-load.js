"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: ["PUT", "POST"],
	path: "/loads/cancel",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => cancel_load(body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: 'cancelld', detail: e }) );
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nobody"); }
		else if (requestBody.load) { resolve(); }
		else { reject("noload"); }
	});
}

function cancel_load (requestBody) {
	return new Promise((resolve, request) => {
		mysql.query("loads/cancel_load", requestBody)
		.then( () => resolve() )
		.catch(e => reject(["sql", e]) );
	});
}
