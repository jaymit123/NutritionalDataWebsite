/**
 * RecipeDatabase
 * @module lib/RecipeDatabase
 */
var documentClient = require("documentdb").DocumentClient;
var config = require('./config');
var url = require("url");
var client = new documentClient(config.endpoint, { "masterKey": config.primaryKey });
var HttpStatusCodes = { NOTFOUND: 404 };
var databaseUrl = `dbs/${config.database.id}`;
var collectionUrl = `${databaseUrl}/colls/${config.collection.id}`;
var util = require('util');



/**
 * Insert a specified document.
 * @param {*} jsonObj - json form of the document to be inserted
 */
function insertDocument(jsonObj) {
    client.createDocument(collectionUrl, jsonObj, (err, done) => { if (err) throw err; });
}




/**
 * Select all recipe documents having a specific ingredient from given collection in cosmos db.
 * @param {*} fields - contains the name of the recipe
 * @param {*} func - callback function to be executed.
 */
function selectedIngredeint(fields, func) {
    var iterator = client.queryDocuments(collectionUrl, "select * from doc d WHERE CONTAINS (d.recipe,'" + fields.Recipe + "')");
    iterator.toArray(func);
}

/**
 * Get all documents to be deleted having fat greater then and weight less then specified range.
 * @param {*} fields - contains range variables for fat and weight
 * @param {*} func - callback function to be executed.
 */
function queryDeleteWF(fields, func) {
    var iterator = client.queryDocuments(collectionUrl, "select * from doc d WHERE d.fat >= " + fields.fat + " and d.weight <= " + fields.weight);
    iterator.toArray(func);
}


/**
 * Get all documents having specific ingredient
 * @param {*} name  - name of the ingredient
 * @param {*} func - callback function to be executed.
 */
function queryIngredient(name, func) {
    var iterator = client.queryDocuments(collectionUrl, "select d.image,d.id from doc d WHERE CONTAINS (d.recipe,'" + name + "')");
    console.log("select d.image from doc d WHERE CONTAINS (d.recipe,'" + name + "')");
    iterator.toArray(func);
}


/**
 * Get all documents having calories in a specified range.
 * @param {*} fields  - contains lower (cr1) and upper (cr2) range variables of calorie
 * @param {*} func - callback function to be executed
 */
function queryIngredientInRange(fields, func) {
    var iterator = client.queryDocuments(collectionUrl, "select d.image,d.id,d.type,d.calories from doc d WHERE d.calories Between " + fields.cr1 + " and " + fields.cr2 + "");
    iterator.toArray(func);
}

/**
 * Get all document having calories greater then a specific range and having a specific ingredient.
 * @param {*} fields - contains the lower range(cr1) of calorie and name of specified ingredient (recipe)
 * @param {*} func - callback function to be executed.
 */
function queryIngredientInRangeWithIng(fields, func) {
    var iterator = client.queryDocuments(collectionUrl, "select d.image,d.id from doc d WHERE (d.calories >= " + fields.cr1 + ") and CONTAINS (d.recipe,'" + fields.Recipe + "')");
    iterator.toArray(func);
}

/**
 * Replace a specific ingredient in a document
 * @param {*} document - the new document with which the old document needs to be replaced
 * @param {*} func - callback function to be executed.
 */
function replaceIngredient(document, func) {
    var docurl = collectionUrl + "/docs/" + document['id']; // the document id of the old document
    client.replaceDocument(docurl, document, func);

}

/**
 * Delete a specified document from collection.
 * @param {*} document - the json object of the document to be deleted.
 * @param {*} func - callback function to be executed,
 */
function deleteWF(document, func) {
    var docurl = collectionUrl + "/docs/" + document['id'];
    client.deleteDocument(docurl, document, func);

}



exports.queryIngredient = queryIngredient;
exports.insertDocument = insertDocument;
exports.queryIngredientInRange = queryIngredientInRange;
exports.queryIngredientInRangeWithIng = queryIngredientInRangeWithIng;
exports.selectedIngredeint = selectedIngredeint;
exports.replaceIngredient = replaceIngredient;
exports.deleteWF = deleteWF;
exports.queryDeleteWF = queryDeleteWF;