var express = require('express');
var router = express.Router();
var controllers = require('../controllers/index');
var middleware = require('../utils/middleware');


// create room
router.post('/create', middleware.validateToken, function(req, res, next) {
    controllers.room.create(req, res, next);
});


// get all rooms info of currently logged in user (user info via jwt)
router.get('/', middleware.validateToken, function(req, res, next) {
    controllers.room.getRoom(req, res, next);
});


// add attendee to a room
router.post('/addToRoom', middleware.validateToken, function(req, res, next) {
    controllers.room.addAttendeeToRoom(req, res, next);
});


// check if room exists
router.get('/roomExist', function(req, res, next) {
    controllers.room.roomIsValid(req, res, next);
});



module.exports = router;
