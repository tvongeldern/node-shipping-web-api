"use strict";
const mysql = require("../../globals/sql_templating.js");

exports.endpoint = inst => inst.route({
	method: "GET",
	path: "/loads/available",
	handler: (request, response) => {
		mysql.query("loads/available_loads", {})
		.then(data => response(data) )
		.catch(e => response({ error: "availableloads", detail: e }) );
	}
});
