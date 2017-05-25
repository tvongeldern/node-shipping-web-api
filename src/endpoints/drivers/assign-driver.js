"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const validations = require("../../globals/validations");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: ["PUT", "POST"],
	path: "/drivers/assign",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validate_load_or_bid(body) )
		.then( () => validations.user(body.driver, constants.user_types.driver) )
		.then( () => assign_driver(body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: "assigndr", detail: e }) );
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nobody"); }
		else if (requestBody.driver && (requestBody.load || requestBody.bid)) { resolve(); }
		else if (!requestBody.driver && !requestBody.bid) { reject("notarget"); }
		else { reject("noload"); }
	});
}

function validate_load_or_bid (requestBody) {
	const query = requestBody.bid ? 'bids/verify_bid' : "loads/verify_load_covered";
	return new Promise((resolve, reject) => {
		mysql.query(query, requestBody)
		.then(data => {
			if (data && data.exists) { resolve(); }
			else { reject("verifyfailed"); }
		})
		.catch(e => reject([ "sql", e ]) );
	});
}

function assign_driver (requestBody) {
	var obj = {
		driver: requestBody.driver
	};
	if (requestBody.bid) { obj.bid = requestBody.bid; }
	else { obj.load = requestBody.load; }
	return new Promise((resolve, reject) => {
		mysql.query("drivers/assign_driver", obj)
		.then( () => resolve() )
		.catch(e => reject([ "sql", e ]) );
	});
}
