var documentClient = require("documentdb").DocumentClient;
var config = require('./config');
var url = require("url");
var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });
var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;
var util = require('util');




function addPhoto(jsonObj) {

    console.log(util.inspect(config));
    client.createDocument(collectionUrl, jsonObj, function(err, done) {

        if (err) console.log(err);

    });
}



function getPhotos(name, func) {
    var documentUrl = `${collectionUrl}/docs/${name}`;
    client.readDocument(documentUrl, {}, func);
}

exports.getPhotos = getPhotos;
exports.addPhoto = addPhoto;