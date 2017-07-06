var fs = require('fs');
var nosqldb = require('./nosqldb');
var util = require('util');
var hogan = require('hogan.js');
var atpl = require('atpl');
var filehound = require('filehound');
var csv = require('fast-csv');

var dict = {};

var handler = {
    '/': index,
    '/registerPhoto': uploadDocument,
    '/findIngredient': findIngredient,
    '/populateDB': uploadDirectory,
    "/recipeRange": findRecipeRange,
    "/recipeRngWithIng": findRecipeRangeWithIng,
    "/replaceIng": replaceIngredeint,
    "/deleteWF": deleteRecipeWF

};


function index(response) {
    fs.readFile(__dirname + '/../public/index.html', function(err, data) {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        response.end(data);
    });
}

function uploadDocument(response, postData) {
    nosqldb.insertDocument(postData);
    response.end("Sucessfully Uploaded");

}

function findRecipeRange(response, postData) {
    nosqldb.seletecIngredeint(postData.fields, function(err, result) {
        if (err) console.log(err);

        atpl.renderFile(__dirname + '/../public', 'displayimage.html', { list: result, time: process.hrtime(postData.time), count: result.length }, false, function(err, res) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(res);
        });


    });
}

function replaceIngredeint(response, postData) {
    nosqldb.seletecIngredeint(postData.fields, function(err, result) {
        if (err) console.log(err);

        result.forEach((x) => {
            x['recipe'] = x['recipe'].replace(postData.fields.Recipe, postData.fields.RecipeReplace);
            console.log(x['recipe']);

            nosqldb.replaceIngredient(x,
                function(err, updatedDocument, responseOptions) {
                    if (err) console.log(err);
                    response.end("Done");
                }
            );
        });


        /*        atpl.renderFile(__dirname + '/../public', 'displayimage.html', { list: result, time: process.hrtime(postData.time), count: result.length }, false, function(err, res) {
                    response.writeHead(200, { 'Content-Type': 'text/html' });
                    response.end(res);
                });*/


    });
}


function findRecipeRange(response, postData) {
    nosqldb.queryIngredientInRange(postData.fields, function(err, result) {
        if (err) console.log(err);

        atpl.renderFile(__dirname + '/../public', 'displayimage.html', { list: result, time: process.hrtime(postData.time), count: result.length }, false, function(err, res) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(res);
        });


    });
}

function deleteRecipeWF(response, postData) {
    nosqldb.queryDeleteWF(postData.fields, function(err, result) {
        if (err) console.log(err);
        atpl.renderFile(__dirname + '/../public', 'displayimage.html', { list: result, time: process.hrtime(postData.time) }, false, function(err, res) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(res);
        });
        result.forEach((x) => {

            nosqldb.deleteWF(x,
                function(err, x) {
                    if (err) console.log(err);
                }
            );
        });

    });
}

function findRecipeRangeWithIng(response, postData) {
    nosqldb.queryIngredientInRangeWithIng(postData.fields, function(err, result) {
        if (err) console.log(err);

        atpl.renderFile(__dirname + '/../public', 'displayimage.html', { list: result, time: process.hrtime(postData.time), count: result.length }, false, function(err, res) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(res);
        });


    });
}


function findIngredient(response, postData) {
    nosqldb.queryIngredient(postData.fields.ingredient, function(err, result) {
        if (err) console.log(err);

        atpl.renderFile(__dirname + '/../public', 'displayimage.html', { list: result, time: process.hrtime(postData.time) }, false, function(err, res) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(res);
        });


    });
}


function uploadDirectory(response, postData) {
    var store = {};
    var directory = __dirname + "/data"
    var file = null;
    var files = filehound.create().paths(directory).ext("csv").find().then(files => {
        files.forEach((file) => {

                filename = getFileName(file);
                imagefile = file.replace(filename + ".csv", filename + ".jpg");
                sendData(file, imagefile, filename, response);

            }

        );

    })
}

function getFileName(file) {
    arr = file.split('/');
    csvFile = arr[arr.length - 1];
    filename = csvFile.split(".")[0];
    return filename;

}

function sendData(csvFile, imageFile, filename, response) {
    var storeData = [];

    fs.createReadStream(csvFile).pipe(csv()).on('data', (data) => {
        storeData.push(data);
    }).on('end', (data) => {
        var imagedata = fs.readFileSync(imageFile).toString('base64');
        var re = new RegExp("^\\d+$");
        var jsonFile = { id: filename, image: imagedata, recipe: "", calories: (re.test(storeData[0][2].trim())) ? parseInt(storeData[0][2]) : 0, fat: (re.test(storeData[0][1].trim())) ? parseInt(storeData[0][1]) : 0, weight: (re.test(storeData[0][0].trim())) ? parseInt(storeData[0][0]) : 0, type: storeData[2][0].trim() };
        for (i = 0; i < storeData[0].length; i++) {
            var ingredientName = storeData[1][i].trim();
            jsonFile["recipe"] += " , " + ingredientName;
            /*            jsonFile["fat"] =*/
            /*          if (ingredientName in dict) {
                          dict[ingredientName] += 1;
                      } else {
                          dict[ingredientName] = 1;
                      }*/
            /*              
                       var re = new RegExp("^\\d+$");
                       jsonFile['calories'] += (re.test(storeData[0][i].trim())) ? parseInt(storeData[0][i]) : 0;
                       console.log(util.inspect(jsonFile));*/
        }
        uploadDocument(response, jsonFile);
    });


}

exports.handler = handler;