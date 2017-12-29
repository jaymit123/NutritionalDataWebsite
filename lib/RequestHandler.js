/**
 *  Request Handler
 * @module lib/requestHandler
 */
var fs = require('fs');
var nosqldb = require('./RecipeDatabase');
var util = require('util');
var atpl = require('atpl');
var filehound = require('filehound');
var csv = require('fast-csv');




/**
 * Send index.html file to client based on request for path '/'
 * @param {*} response - Send Response to client
 */
function index(response) {
    fs.readFile(__dirname + '/../public/index.html', function (err, data) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
    });
}


/**
 * Replace a ingredient in the recipes with a new ingredient.
 * @param {*} response - Used to send response back to user
 * @param {*} postData - Contains the ingredient name to be searched for in recipes and the name of new ingredient with which it should be replaced.
 */
function replaceIngredient(response, postData) {
    //Search for the recipes having the ingredient specified.
    nosqldb.selectedIngredient(postData.fields, function (err, result) {
        checkError(err);
        //for each recipe matching the criteria, replace the ingredient with a new ingredient
        result.forEach((recipe) => {
            recipe['recipe'] = recipe['recipe'].replace(postData.fields.Recipe, postData.fields.RecipeReplace);
            nosqldb.replaceIngredient(recipe,
                function (err, updatedDocument, responseOptions) {
                    result = { documents: [updatedDocument], startTime: postData.time, count: 1 };
                    sendResponse(err, result,response);
                }
            );
        });
    });
}




/**
 * Find all recipes having specified calories in a given range between cr1 and cr2.
 * @param {*} response - Used to send response to client
 * @param {*} postData - Contains range of calories (cr1 and cr2) 
 */
function findRecipeRange(response, postData) {
    nosqldb.queryRecipeInCalorieRange(postData.fields, (err, result) => {
        data = { documents: result, startTime: postData.time, count: (result) ? result.length : 0 };
        sendResponse(err, data,response);
    });
}



/**
 * allow a user to remove all foods greater than a specific fat contents which weigh less than a specified amount       
 * Show matching entries (pictures) before removing.
 * @param {*} response -Used to send response to client
 * @param {*} postData - contains vairables fat and weight 
 */
function queryRecipeWithFatAndWeight(response, postData) {
    nosqldb.queryRecipeWithFatAndWeight(postData.fields, function (err, result) {
        sendResponse(err, data); data = { documents: result, startTime: postData.time, count: (result) ? result.length : 0 };
        result.forEach((document) => nosqldb.deleteDocument(document, (err, result) => checkError(err,response)));
    });
}

/**
 * Find recipes having calories greater then speicified range(cr1) and with a specific ingredient(recipe).
 * @param {*} response - Used to send response back to client
 * @param {*} postData - contains cr1 and recipe variable
 */
function findRecipeRangeWithIng(response, postData) {
    nosqldb.queryRecipeWithCalorieAndIng(postData.fields, function (err, result) {
        data = { documents: result, startTime: postData.time, count: (result) ? result.length : 0 };
        sendResponse(err, data,response);
    });
}

/**
 * Find recipes with specified ingredient
 * @param {*} response -Used to send response back to client.
 * @param {*} postData - contains ingredient variable
 */
function findIngredient(response, postData) {
    nosqldb.queryIngredient(postData.fields.ingredient, function (err, result) {
        data = { documents: result, startTime: postData.time, count: (result) ? result.length : 0 };
        sendResponse(err, data,response);
    });
}

/**
 * Used to upload entire data directory  containing recipe information into Azure Cosmos DB in JSON format.
 * @param {*} response - used to send response to the client
 * @param {*} postData - 
 */
async function uploadDirectory(response, postData) {
    var store = {};
    var directory = __dirname + "/data"
    var file = null;
    //Get path of all csv files in the data directory
    var files = await filehound
        .create()
        .paths(directory)
        .ext("csv")
        .find()
        .then(files => files);

    // For each path get the name of file. process and send the data to cosmos db.
    files
        .forEach(filepath => {
            filename = getFileName(filepath);
            imagepath = filepath.replace(filename + ".csv", filename + ".jpg");
            sendData(filepath, imagepath, filename, response);
        }
        );
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.end("Sucessfully Uploaded Files!");
}



/**
 * Processes the data of a file by adding it to a dictionary and uploading it to cosmos db.
 * @param {*} csvFile - Name of the csv file to be uploaded
 * @param {*} imagepath - name of the image file to be uploaded
 * @param {*} filename -  name of the file without any extension
 * @param {*} response - used to send response back to the client
 */
function sendData(csvFile, imagepath, filename, response) {
    let storeData = [];

    fs
        .createReadStream(csvFile)
        .pipe(csv())
        //read data from csv row wise and append it to array
        .on('data', data => {
            storeData.push(data);
        })
        //create a json variable and append all the information to it. 
        .on('end', () => {
            const imagedata = fs.readFileSync(imagepath).toString('base64');
            const re = new RegExp("^\\d+$");
            const calories = (re.test(storeData[0][2].trim())) ? parseInt(storeData[0][2]) : 0;
            const fat = (re.test(storeData[0][1].trim())) ? parseInt(storeData[0][1]) : 0;
            const weight = (re.test(storeData[0][0].trim())) ? parseInt(storeData[0][0]) : 0;
            const type = storeData[2][0].trim();
            const recipe = { id: filename, image: imagedata, recipe: "", calories: calories, fat: fat, weight: weight, type: type };
            for (i = 0; i < storeData[0].length; i++) {
                var ingredientName = storeData[1][i].trim();
                recipe["recipe"] += " , " + ingredientName;
            }
            nosqldb.insertDocument(recipe);
        });


}

/**
 * Extract filename from filepath
 * @param {String} filepath - contains entire filepath of csv file. 
 */
function getFileName(filepath) {
    arr = filepath.split('/');
    csvFileName = arr[arr.length - 1];
    filename = csvFileName.split(".")[0];
    return filename;
}

/**
 * Send Response back to client by loading html file with data
 * @param {*} err - error message occured while processing request
 * @param {*} data - the data to be parsed into the html file.
 */
function sendResponse(err, data,response) {
    checkError(err,response);
    atpl.renderFile(__dirname + '/../public', 'displayimage.html', { list: result.documents, time: process.hrtime(result.startTime), count: result.count }, false, function (err, res) {
        checkError(err,response);
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(res);
    });
}

/**
 * Send Error Message to Client
 * @param {*} err - The error object containing the message about why the error occured.
 */
function checkError(err,response) {
    if (err) {
        response.writeHead(500, { 'Content-Type': 'text/html' });
        response.end("An error occured while processing your request. " + err.message);
    }
}

module.exports = {
    '/': index,
    '/findIngredient': findIngredient,
    '/populateDB': uploadDirectory,
    "/recipeRange": findRecipeRange,
    "/recipeRngWithIng": findRecipeRangeWithIng,
    "/replaceIng": replaceIngredient,
    "/deleteWF": queryRecipeWithFatAndWeight

};