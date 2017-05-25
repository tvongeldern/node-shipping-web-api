"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");
const constants = require("../../globals/constants.js");

exports.endpoint = inst => inst.route({
	method: [ "PUT", "POST" ],
	path: "/reviews/add",
	handler: (request, response) => {
		var body = request.payload;
		validate_request(body)
		.then( () => validate_load_and_vendor(body) )
		.then( () => validate_unreviewed(body) )
		.then( () => add_review(body) )
		.then( () => response(constants.http_responses.generic_success) )
		.catch(e => response({ error: "writereview", detail: e}) );
	}
});

function validate_request (requestBody) {
	return new Promise((resolve, reject) => {
		if (!requestBody) { reject("nobody"); }
		else if (!requestBody.reviewer) { reject("noauthor"); }
		else if (!requestBody.load) { reject("noload"); }
		else if (!requestBody.vendor && !requestBody.warehouse) { reject("novendor"); }
		else if (requestBody.vendor && requestBody.warehouse) { reject("twovendors"); }
		else if (requestBody.reviewer == requestBody.vendor) { reject("selfreview"); }
		else if (!requestBody.rating) { reject("nocontent"); }
		else if (parseInt(requestBody.rating) > 5 || parseInt(requestBody.rating) < 1) { reject("ratingrange"); }
		else {
			requestBody.rating = parseInt(requestBody.rating);
			if (!/[a-zA-Z]{3}/ig.test(requestBody.review)) { requestBody.review = null; }
			resolve();
		}
	});
}

function validate_load_and_vendor (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("loads/verify_load_delivered", requestBody)
		.then(data => {
			if (data && data.exists) { resolve(); }
			else { reject("noexist"); }
		})
		.catch(e => reject([ "sql", "validate_load", e ]) );
	});
}

function validate_unreviewed (requestBody) {
	console.log(requestBody);
	return new Promise((resolve, reject) => {
		mysql.query("reviews/validate_unreviewed", requestBody)
		.then(data => {
			if (data && data.exists) { reject("unrevwdval"); }
			else if (data) { resolve(); }
			else { reject([ "nodata", "valunrev" ]); }
		})
	});
}

function add_review (requestBody) {
	return new Promise((resolve, reject) => {
		mysql.query("reviews/add_review", requestBody)
		.then( () => resolve() )
		.catch(e => reject(["sql", "writereview", e ]) );
	});
}
