var express = require('express');
var router = express.Router();
var controllers = require('../controllers/index');


/* Join Meeting */
router.post('/create',  function(req, res, next) {
    controllers.user.create(req, res, next);
});


module.exports = router;
