/**
 * Server module
 * @module lib/Server
 * Class used to create a server
 */

var http = require('http');
var url = require('url');
var multer = require('multer');
var util = require('util');



class Server {
    /**
     * Creates a server instance
     * @param {*} route -  The router which handler request based on pathname.
     * @param {*} handler - the handler which contains method to be executed based on pathname.
     */
    constructor(route, handler) {
        this.route = route;
        this.handler = handler;
        this.port = process.env.PORT || 1337;
    }

    /**
     * Starts a server instance
     */
    startServer() {
        let requestHandler = this.onRequest.bind(this);
        let port = this.port;
        http.createServer(requestHandler).listen(port);
        console.log("Server running at http://localhost:%d", port);
    }

    /**
     * This method is executed whenever a request is sent by a client.
     * @param {*} request - contains raw, unprocessed request information
     * @param {*} response - used to send response to the client.
     */
    async onRequest(request, response) {
        var postData = null;
        let handler = this.handler;
        const pathname = url.parse(request.url).pathname;
        switch (pathname) {
            case '/registerPhoto':
                await this.uploadImage(request, response, pathname, handler);
                break;

            case "/findIngredient":
            case "/recipeRange":
            case "/recipeRngWithIng":
            case "/replaceIng":
            case "/deleteWF":
            case "/maxfat":
                await this.processForm(request, response, pathname, handler);
                break;


            default:
                this.route(pathname, handler, response, postData);
                break;


        }
    }

    /**
     * Process the request data, stores info into a dictionary and sends it to the route handler.
     * @param {*} request - contains raw, unprocessed request information
     * @param {*} response - used to send response to the client
     * @param {*} pathname - path for which request is to be processed 
     * @param {*} handler - the handler which contains method to be executed based on pathname.
     */
    async processForm(request, response, pathname, handler) {
        const upload = multer().array();
        try {
            await upload(request, response);
            const postData = { "fields": request.body, "time": process.hrtime() };
            this.route(pathname, handler, response, postData);
        } catch (ex) {
            response.send('error while prcoessing  post data. please try again.');
        }

    }
    /**
     * Handles image upload request, and sends it to route handler.
     * @param {*} request - contains raw, unprocessed request information
     * @param {*} response - used to send response to the client
     * @param {*} pathname  - path for which request is to be processed 
     * @param {*} handler - the handler which contains method to be executed based on pathname.
     */
    async  uploadImage(request, response, pathname, handler) {
        const upload = multer({ storage: multer.memoryStorage() }).single('file');
        try {
            await upload(request, response);
            console.log(request.body)
            const postData = { 'data': request.file.buffer.toString('base64'), 'fields': request.body, 'filename': request.file.originalname };
            console.log(postData);
            this.route(pathname, handler, response, postData);
        } catch (ex) {
            response.send('error while uploading file. please try again.');
        }
    }


}


module.exports = Server;