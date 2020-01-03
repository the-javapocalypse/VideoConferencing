var express = require('express');
var router = express.Router();
var controllers = require('../controllers/index');




/* Join Meeting */
router.post('/join',  function(req, res, next) {
     controllers.chime.joinMeeting(req, res, next);
});

/* Attendee Info */
router.get('/attendee',  function(req, res, next) {
     controllers.chime.attendee(req, res, next);
});

module.exports = router;
