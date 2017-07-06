function route(pathname, handle, response, postData) {
    console.log(typeof handle[pathname]);

    if (typeof handle[pathname] == 'function') {
        switch (pathname) {
            case "/":
            case "/findIngredient":
            case "/populateDB":
            case "/recipeRange":
                handle[pathname](response, postData);
                break;

            case "/registerPhoto":
                handle[pathname](response, postData);
                break;





        }
    }

}

exports.route = route;