"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const validations = require("../../globals/validations");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: [ "PUT", "POST" ],
	path: "/updates/location",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validations.user(body.driver, constants.user_types.driver) )
		.then( () => store_update(body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: "addupdate", detail: e }) );
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nobody"); }
		else if (requestBody.lat && requestBody.lon && requestBody.driver) { resolve(); }
		else if (!requestBody.driver) { reject("nodriver"); }
		else { reject("needlatandlon"); }
	});
}

function store_update (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("updates/add_update", requestBody)
		.then( () => resolve() )
		.catch(e => reject([ "sql", "store_update", e ]) );
	});
}
