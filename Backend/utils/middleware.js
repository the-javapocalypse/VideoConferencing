const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');

module.exports.validateToken = function (req,res,next) {
    passport.authenticate('jwt', {session: false}, (err, user, info) => {
        if (err) {
            console.log(err);
        }
        if (info != undefined) {
            console.log(info.message);
            res.status(messages.FORBIDDEN.code).send(messages.FORBIDDEN);
        } else {
            next()
        }
    });
}
