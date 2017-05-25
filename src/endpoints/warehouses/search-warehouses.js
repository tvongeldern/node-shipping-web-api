"use strict";
const mysql = require("../../globals/sql_templating.js");
const Promise = require("bluebird");

exports.endpoint = inst => inst.route({
	method: "GET",
	path: "/warehouses/search",
	handler: (request, response) => {
		var params = request.query;
		const queryFile = params.term ? "warehouses/search_warehouses_oneterm" : "warehouses/search_warehouses";
		mysql.query(queryFile, params)
			.then(data => response(data) )
			.catch(e => response({ error: "whssearch", detail: e }) );
	}
});
