/**
 * Middleware function to check if a user session has been created (isAuthenticated)
 * @return {Response} 401 if user is not logged in
 */
module.exports = function (req, res, next) {
    if (req.user){
        console.log( "Is authenticated OK as (req.user) : ", req.user.login);
        return next();
    }else{
        console.log(" * NOT authenticated -> req.user does not exist       [SERVER][check-routes.js] ")// test console dev phase
        // console.log(" * req -----> ",req)
        // console.log(" * res -----> ",res)
        return res.status(401).json('IsAuthenticated: No logged')
    }
}


