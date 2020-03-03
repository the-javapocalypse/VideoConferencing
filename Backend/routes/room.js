var express = require('express');
var router = express.Router();
var controllers = require('../controllers/index');
var middleware = require('../utils/middleware');


// Create room
router.post('/create', middleware.validateToken, function(req, res, next) {
    controllers.room.create(req, res, next);
});

module.exports = router;
