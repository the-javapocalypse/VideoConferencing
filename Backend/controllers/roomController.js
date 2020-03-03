const models = require('../models');
const msg = require('../utils/messages');
const log = require('../utils/logger');
const validator = require('../utils/validator');
const crypto = require('../utils/crypto');

module.exports = {

    // Create room
    create(req, res, next) {
        if (req.body.title) {

            // plaint text to encrypt
            let pt = req.body.title + '~~~' + res.locals.user.email;
            let ct = crypto.encrypt(pt);

            // create room
            models.Room.create({
                name: req.body.title,
                digest: ct,
                created_by: res.locals.user.id,
                is_active: true
            })
                .then(succ => {
                    res.status(msg.SUCCESSFUL.code).send(msg.SUCCESSFUL.message);
                })
                .catch(error => {
                    res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR.message);
                });

        } else {
            res.status(msg.BAD_REQUEST.code).send(msg.BAD_REQUEST.message);
        }
    }

};
