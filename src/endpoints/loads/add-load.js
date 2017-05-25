"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const validations = require("../../globals/validations");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: [ "POST", "PUT" ],
	path: "/loads/add",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validations.user(body.customer, constants.user_types.customer) )
		.then( () => validate_stops(body.stops) )
		.then( () => mysql.query("loads/add_load", body, {responseIndex: 1}) )
		.then(data => response(data) )
		.catch(e => response({ error: "addload", detail: e }));
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject('nodata'); }
		else if (!requestBody.customer) { reject('nocust'); }
		else if (!requestBody.stops || requestBody.stops.length == 0) { reject('nostops'); }
		else if (requestBody.stops.length == 1) { reject('onestop'); }
		else if (requestBody.stops[requestBody.stops.length - 1]["action"] == constants.stop_actions.pick) { reject("laststoppick"); }
		else { resolve(); }
	});
}

function validate_stops (stops) {
	var arr = [];
	if (stops.length == 2) {
		stops[0].action = constants.stop_actions.pick;
		stops[1].action = constants.stop_actions.deliver;
	}
	stops.forEach( stop => arr.push(validate_ind_stop(stop)) );
	return Promise.all(arr);
}

function validate_ind_stop (stop) {
	const reqs = [ "action", "whsId", "earlyTime", "earlyDate", "lateTime", "lateDate" ];
	return new Promise((resolve, reject) => {
		reqs.forEach(req => {
			if (!stop[req]) {
				reject("no" + req);
			}
		});
		mysql.query("warehouses/verify_warehouse", stop)
		.then(data => {
			if (!data) { reject("nodata"); }
			else if (data.exists) { resolve(); }
			else { reject("whsnotfound"); }
		})
		.catch(e => reject("mysqlconnection") );
	});
}
