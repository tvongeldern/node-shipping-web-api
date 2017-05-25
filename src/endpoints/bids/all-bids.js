"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");

exports.endpoint = inst => inst.route({
	method: "GET",
	path: "/bids/all",
	handler: (request, response) => {
		var params = request.query;
		validate_request(params)
		.then( () => mysql.query("bids/all_bids", params) )
		.then(data => response(data) )
		.catch(e => response({ error: "searchbids", detail: e }) );
	}
});

function validate_request (requestQuery) {
	return new Promise((resolve, reject) => {
		if (!requestQuery) { reject("nodata") }
		else if (!requestQuery.bid && !requestQuery.load && !requestQuery.customer) { reject("missingparams") }
		else if (Object.keys(requestQuery).length > 1) { reject("multiparams") }
		else { resolve() }
	});
}
