"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const validations = require("../../globals/validations");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: [ "POST", "PUT" ],
	path: "/bids/add",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validations.user(body.carrier, constants.user_types.carrier) )
		.then( () => validate_bidAgent(body) )
		.then( () => validate_counterTo(body) )
		.then( () => validate_load(body.load) )
		.then( () => validate_adjustments(body) )
		.then( () => mysql.query("bids/add_bid", body, { responseIndex: 1 }) )
		.then(data => response(data) )
		.catch(e => response({error: e}) );
	}
});

function validate_request (requestBody) {
	const reqs = [ "load", "rate", "carrier", "bidAgent" ];
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nobody"); }
		else if (requestBody.load && requestBody.rate && requestBody.carrier && requestBody.bidAgent) { resolve(); }
		else if (!requestBody.load) { reject("noload"); }
		else if (!requestBody.rate) { reject("norate"); }
		else if (!requestBody.carrier) { reject("nocarrier"); }
		else { reject("nobidagent"); }
	});
};

function validate_bidAgent (requestBody) {
	return new Promise((resolve, reject) => {
		if (requestBody.bidAgent == requestBody.carrier) { resolve(); }
		else {
			mysql.query("bids/validate_bidAgent", requestBody)
			.then(rows => {
				if (!rows || !rows[0] || !rows[0].user_type) {
					reject([ "bidagent", "noexist" ]);
				} else if (rows[0].user_type == 1 && !requestBody.counterTo) {
					reject([ "bidagent", "custnocounter" ]);
				} else {
					resolve();
				}
			})
			.catch(e => reject([ "bidagent", "mysql" ]) );
		}
	});
}

function validate_counterTo (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody.counterTo) { resolve(); }
		else {
			mysql.query("bids/validate_counter", requestBody)
			.then(data => {
				if (data && data.exists) { resolve(); }
				else { reject("countertoval"); }
			})
			.catch(e => reject([ "sql", e ]) );
		}
	});
}

function validate_load (load) {
	return new Promise((resolve, reject) => {
		mysql.query("loads/verify_load_available", {load})
		.then(data => {
			if (!data) { reject("nodata"); }
			else if (data.exists) { resolve(); }
			else { reject("noavl"); }
		})
		.catch(e => reject("sqlconnvalavl") )

	});
}

function validate_adjustments (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody.changes || !requestBody.changes.length) { resolve(); }
		else {
			let stopChanges = [];
			requestBody.changes.forEach(change => {
				change.loadId = requestBody.load;
				stopChanges.push(validate_change(change));
			});
			Promise.all(stopChanges)
				.then( () => resolve() )
				.catch(e => reject([ "changes", e ]) );
		}
	});
}

function validate_change (change) {
	return new Promise((resolve, reject) => {
		if (!change.stopId) { reject("nostopid"); }
		else if (!change.newDate && !change.newTime) { reject("nochange"); }
		else {
			mysql.query("bids/validate_adjustment", change)
			.then(data => {
				if (data && data.exists) { resolve(); }
				else { reject("changeval"); }
			})
			.catch(e => reject([ "sql", "change", e ]) );
		}
	});
}
