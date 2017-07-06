var http = require('http');
var url = require('url');
var multer = require('multer');
var util = require('util');


function start(route, handler) {

    function onRequest(request, response) {
        var postData = null;
        var pathname = url.parse(request.url).pathname;
        console.log(pathname);
        switch (pathname) {

            case '/registerPhoto':

                var upload = multer({ storage: multer.memoryStorage() }).single('file');
                upload(request, response, function(err) {
                    if (err) throw err;
                    postData = { 'data': request.file.buffer.toString('base64'), 'fields': request.body, 'filename': request.file.originalname };
                    route(pathname, handler, response, postData);
                });
                break;

            case "/findIngredient":
            case "/recipeRange":
            case "/recipeRngWithIng":
                console.log("wadaw");
                var upload = multer().array();
                upload(request, response, function(err) {
                    postData = { "fields": request.body, "time": process.hrtime() };
                    route(pathname, handler, response, postData);
                });
                break;


            default:
                route(pathname, handler, response, postData);
                break;


        }
    }
    var port = process.env.PORT || 1337;
    http.createServer(onRequest).listen(port);
    console.log("Server running at http://localhost:%d", port);

}

exports.start = start;