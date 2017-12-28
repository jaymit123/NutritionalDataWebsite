const server = require('./lib/Server');
const route = require('./lib/Router');
const requestHandler = require('./lib/RequestHandler');

const serverInstance = new server(route, requestHandler);
serverInstance.startServer();