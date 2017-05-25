"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: [ "POST", "PUT" ],
	path: "/users/login",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validate_login(body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({error: "login", detail: e}) )
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nodata") }
		else if (!requestBody.username && !requestBody.userId) { reject("nouser") }
		else if (!requestBody.password) { reject("nopw") }
		else { resolve() }
	});
}

function validate_login (request) {
	return new Promise ((resolve, reject) => {
		mysql.query("users/validate_login", request)
		.then(data => {
			if (!data) { reject("nodata") }
			else if (data.exists) { resolve() }
			else { reject("credentials") }
		})
	});
}
