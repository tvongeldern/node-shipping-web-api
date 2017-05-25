"use strict";
const mysql = require("./sql_templating.js");
const Promise = require("bluebird");

function validate_user (uid, type) {
	return new Promise((resolve, reject) => {
		mysql.query("users/validate_user", {uid, type})
		.then(data => {
			if (!data) { reject("nodata") }
			else if (data.exists) { resolve() }
			else { reject("usernotfound") }
		})
		.catch(e => reject("sqlconnusr"));
	});
}

exports.user = validate_user
