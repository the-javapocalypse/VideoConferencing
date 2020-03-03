const msg = require('./messages');

const jwtSecret = require('../config/jwtConfig').jwtSecret;


const jwt = require('jsonwebtoken');
const passport = require('passport');
require('../config/passport');
const passportJWT = require('passport-jwt');
let ExtractJwt = passportJWT.ExtractJwt;

module.exports.validateToken = function (req,res,next) {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err) {
            res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR.message);
        }
        if (info != undefined || !user) {
            res.status(msg.AUTHENTICATION_FAILED.code).send(msg.AUTHENTICATION_FAILED.message);
        } else {
            res.locals.user = user;
            next();
        }
    })(req, res, next);
}

