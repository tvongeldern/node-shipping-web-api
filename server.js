// INIT
"use strict";
const server = require("./src/_head.js");
const instance = server.instance;

//ENDPOINTS
require("./src/endpoints/users/add-user.js").endpoint(instance);
require("./src/endpoints/warehouses/add-warehouse.js").endpoint(instance);
require("./src/endpoints/loads/add-load.js").endpoint(instance);
require("./src/endpoints/bids/add-bid.js").endpoint(instance);
require("./src/endpoints/users/login-user.js").endpoint(instance);
require("./src/endpoints/warehouses/search-warehouses.js").endpoint(instance);
require("./src/endpoints/loads/available-loads.js").endpoint(instance);
require("./src/endpoints/bids/all-bids.js").endpoint(instance);
require("./src/endpoints/bids/accept-bid.js").endpoint(instance);
require("./src/endpoints/loads/bounce-load.js").endpoint(instance);
require("./src/endpoints/loads/cancel-load.js").endpoint(instance);
require("./src/endpoints/bids/retract-bid.js").endpoint(instance);
require("./src/endpoints/drivers/assign-driver.js").endpoint(instance);
require("./src/endpoints/updates/add-update.js").endpoint(instance);
require("./src/endpoints/reviews/add-review.js").endpoint(instance);
require("./src/endpoints/updates/en-route.js").endpoint(instance);
require("./src/endpoints/updates/at-location.js").endpoint(instance);
require("./src/endpoints/updates/being-worked.js").endpoint(instance);
require("./src/endpoints/updates/finished.js").endpoint(instance);

//START
server.start();
