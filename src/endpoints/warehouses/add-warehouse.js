"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");

exports.endpoint = inst => inst.route({
	method: [ "POST", "PUT" ],
	path: "/warehouses/add",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => verify_unique(body) )
		.then( () => mysql.query('warehouses/add_warehouse', body) )
		.then(data => response(data) )
		.catch(e => response({error: 'addwhs', detail: e}) );
	}
});


function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		let reqs = [ "name", "address1", "city", "state", "zip" ];
		let len = reqs.length;
		let it;
		for (let i = 0; i < len; i++) {
			it = reqs[i];
			if (!requestBody[it]) {
				reject("no" + it);
				break;
			}
		}
		resolve();
	});
}

function verify_unique (whs) {
	return new Promise((resolve, reject) => {
		mysql.query("warehouses/validate_new_whs", whs)
		.then(data => {
			if (!data) { reject("nodata"); }
			else if (data.exists) { reject("whsexists"); }
			else { resolve() }
		})
		.catch(e => reject(e) )
	});
}
