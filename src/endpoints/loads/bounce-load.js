"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: ["PUT", "POST"],
	path: "/loads/bounce",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => bounce_load(body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: "bounceload", detail: e }) );
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nobody"); }
		else if (requestBody.load) { resolve(); }
		else { reject("noload"); }
	});
}

function bounce_load (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("loads/bounce_load", requestBody)
		.then( () => resolve() )
		.catch(e => reject(['sql', e]) );
	});
}
