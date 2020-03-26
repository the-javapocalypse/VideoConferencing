var express = require('express');
var router = express.Router();
var controllers = require('../controllers/index');
var middleware = require('../utils/middleware');




/* Join Meeting */
router.post('/join', middleware.validateToken, function(req, res, next) {
     controllers.chime.joinMeeting(req, res, next);
});

/* Attendee Info */
router.post('/attendee',  function(req, res, next) {
     controllers.chime.attendee(req, res, next);
});


/* Leave Meeting */
router.post('/leave', middleware.validateToken, function(req, res, next) {
     controllers.chime.leaveMeeting(req, res, next);
});


module.exports = router;
