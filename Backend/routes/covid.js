var express = require('express');
var router = express.Router();
var controllers = require('../controllers/index');


router.post('/', function(req, res, next) {
    controllers.covid.create(req, res, next);
});

module.exports = router;
