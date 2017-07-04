var fs = require('fs');

var handler = {
    '/': index

};


function index(response) {
    fs.readFile(__dirname + '/../public/index.html', function(err, data) {
        console.log(__dirname + "")
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
    });
}

exports.handler = handler;