/*function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }

        res.status(500).json({message: 'failed'});
    }
}*/

function authenticationMiddleware () {
    return function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }

        console.log('redirect');
        return res.redirect("/auth/login");
    }
}

module.exports = authenticationMiddleware();