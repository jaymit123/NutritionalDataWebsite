var server = require("./lib/server");
var route = require('./lib/router');
var requestHandler = require('./lib/requestHandler');
server.start(route.route, requestHandler.handler);