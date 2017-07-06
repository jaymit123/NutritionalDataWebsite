var documentClient = require("documentdb").DocumentClient;
var config = require('./config');
var url = require("url");
var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });
var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;
var util = require('util');




function insertDocument(jsonObj) {

    client.createDocument(collectionUrl, jsonObj, function(err, done) {

        if (err) throw err;

    });
}



function queryIngredient(name, func) {
    var iterator = client.queryDocuments(collectionUrl, "select d.image from doc d WHERE CONTAINS (d.recipe,'" + name + "')");
    console.log("select d.image from doc d WHERE CONTAINS (d.recipe,'" + name + "')");
    /*    var x = client.queryDocuments(collectionUrl, "select * from doc d in d.recipe  ").toArray((err, x) => {

            console.log(x);
        });*/
    iterator.toArray(func);
}

function queryIngredientInRange(fields, func) {
    var iterator = client.queryDocuments(collectionUrl, "select d.image from doc d WHERE d.calories Between " + fields.cr1 + " and " + fields.cr2 + "");
    /*    var x = client.queryDocuments(collectionUrl, "select * from doc d in d.recipe  ").toArray((err, x) => {

            console.log(x);
        });*/
    iterator.toArray(func);
}

exports.queryIngredient = queryIngredient;
exports.insertDocument = insertDocument;
exports.queryIngredientInRange = queryIngredientInRange;