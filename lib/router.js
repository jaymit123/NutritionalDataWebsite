function route(pathname, handle, response) {
    console.log(typeof handle[pathname]);

    if (typeof handle[pathname] == 'function') {
        switch (pathname) {
            case "/":
                handle[pathname](response);

        }
    }

}

exports.route = route;