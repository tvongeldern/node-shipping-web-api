"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: [ "POST", "PUT" ],
	path: "/bids/accept",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validate_bid(body) )
		.then( () => mysql.query("bids/accept_bid", body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: 'acceptbid', detail: e }) );
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nodata"); }
		else if (!requestBody.bid) { reject("nobid"); }
		else { resolve(); }
	});
}

function validate_bid (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("bids/validate_bid_to_accept", requestBody)
		.then(data => {
			if (data && data.exists) { resolve(); }
			else { reject("noexist"); }
		})
		.catch(e => reject(["vbd", "sql", e]) );
	});
}
