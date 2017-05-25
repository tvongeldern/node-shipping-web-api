"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");

exports.endpoint = inst => inst.route({
	method: [ "POST", "PUT" ],
	path: "/users/add",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validate_username(body) )
		.then( () => mysql.query("users/add_user", body) )
		.then(rows => response(rows))
		.catch(e => response({error: e}));
	}
});

function validate_request (body) {
	return new Promise((resolve, reject) => {
		if (!body) { reject("noparams"); }
		else if (!body.username) { reject("nousername"); }
		else if (!body.type) { reject("nousertype"); }
		else if (!body.password) { reject("nopassword"); }
		else { resolve(); }
	});
}

function validate_username (user) {
	return new Promise((resolve, reject) => {
		mysql.query('users/verify_username', user)
			.then(data => {
				if (!data) { reject("nodata"); }
				else if (data.exists) { reject("usernametaken"); }
				else { resolve(); }
			})
			.catch(e => reject('vunsqlconn'));
	});
}
