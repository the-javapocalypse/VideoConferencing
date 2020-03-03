const models = require('../models');
const msg = require('../utils/messages');
const log = require('../utils/logger');
const validator = require('../utils/validator');


module.exports = {

    // Create room
    create(req, res, next){
        if(req.body.title){
            res.send('ok');
        }else{
           res.status(msg.BAD_REQUEST.code).send(msg.BAD_REQUEST.message);
        }
    }

};
