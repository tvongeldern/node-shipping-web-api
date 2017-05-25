"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: ["PUT", "POST"],
	path: "/bids/retract",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => retract_bid(body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: "retractbid", detail: e }) );
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nobody"); }
		else if (requestBody.bid) { resolve(); }
		else { reject("nobid"); }
	});
}

function retract_bid (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("bids/retract_bid", requestBody)
			.then( () => resolve() )
			.catch(e => reject(["sql", e]) );
	});
}
