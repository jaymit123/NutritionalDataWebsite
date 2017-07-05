var fs = require('fs');
var nosqldb = require('./nosqldb');
var util = require('util');
var hogan = require('hogan.js');
var handler = {
    '/': index,
    '/registerPhoto': registerPhoto,
    '/downloadPhoto': getPhoto

};


function index(response) {
    fs.readFile(__dirname + '/../public/index.html', function(err, data) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
    });
}

function registerPhoto(response, postData) {
    var record = { "id": postData.filename, "img_data": postData.data, "img_description": postData.fields.desc, "img_notes": postData.fields.notes, "img_priority": postData.fields.priority };
    nosqldb.addPhoto(record);
    response.end("Successfully Uploaded Image");

}

function getPhoto(response, postData) {
    nosqldb.getPhotos(postData.fields.imgname, function(err, request, header) {
        if (err) throw err;
        fs.readFile(__dirname + '/../public/displayimage.html', function(err, data) {
            if (err) throw err;

            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(hogan.compile(data.toString()).render({ "imagedata": request.img_data, "time": process.hrtime(postData.time) }));
        });


    });
}


exports.handler = handler;