const response = require("../components/response");

exports.verifyToken = (req, res, next) => {
    //Auth header value = > send token into header

    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {

        //split the space at the bearer
        const bearer = bearerHeader.split(' ');
        //Get token from string
        const bearerToken = bearer[1];

        //set the token
        req.token = bearerToken;

        //next middleweare
        next();

    } else {
        //Fobidden
        response.res403(res);
    }

}
exports.config = {
    algorithms: ['HS256'],
    secret: 'shhhh', // TODO Put in process.env
};