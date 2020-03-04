var express = require('express');
var router = express.Router();
var controllers = require('../controllers/index');
var middleware = require('../utils/middleware');




// Create User
router.post('/create',  function(req, res, next) {
    controllers.user.create(req, res, next);
});

// Create Attendee
router.post('/createAttendee',  function(req, res, next) {
    controllers.user.createAttendee(req, res, next);
});

// Login User
router.post('/login',  function(req, res, next) {
    controllers.user.login(req, res, next);
});

// Login Attendee
router.post('/loginAttendee',  function(req, res, next) {
    controllers.user.loginAttendee(req, res, next);
});

// Activate User
router.get('/activateUser/:token', controllers.user.activate);

// protected route
router.post('/test', middleware.validateToken, function(req, res, next) {
    console.log(res.locals.user);
    res.send('Yeyy');
});


module.exports = router;
