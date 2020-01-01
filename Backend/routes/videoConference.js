var express = require('express');
var router = express.Router();
var controllers = require('../controllers/index');




/* Join Meeting */
router.post('/join',  function(req, res, next) {
     controllers.chime.joinMeeting(req, res, next);
});

module.exports = router;
