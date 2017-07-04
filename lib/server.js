var http = require('http');
var url = require('url');


function start(route, handler) {

    function onRequest(request, response) {
        var pathname = url.parse(request.url).pathname;
        console.log(pathname);
        route(pathname, handler, response);

    }
    var port = process.env.PORT || 1337;
    http.createServer(onRequest).listen(port)
    console.log("Server running at http://localhost:%d", port);

}

exports.start = start;