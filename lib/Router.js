/**
 * Routes request to methods based on pathname.
 * @param {*} pathname - name of the requested path.
 * @param {*} handle -  holds the methods to be executed based on pathname.
 * @param {*} response - passed to the the method to send response.
 * @param {*} postData - Contains the variable passed by the request.
 */
module.exports = (pathname, handle, response, postData) => {
    if (typeof handle[pathname] == 'function') {
        switch (pathname) {
            case "/":
            case "/findIngredient":
            case "/populateDB":
            case "/recipeRange":
            case "/recipeRngWithIng":
            case "/replaceIng":
            case "/deleteWF":
            case "/maxfat":
                handle[pathname](response, postData);
                break;

            case "/registerPhoto":
                handle[pathname](response, postData);
                break;
        }
    }
}
