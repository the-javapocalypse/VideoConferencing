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
                    res.status(msg.SUCCESSFUL.code).send(msg.SUCCESSFUL);
                })
                .catch(error => {
                    res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
                });

        } else {
            res.status(msg.BAD_REQUEST.code).send(msg.BAD_REQUEST);
        }
    },


    // get all rooms info of currently logged in user (user info via jwt)
    getRoom(req, res, next) {
        models.Room.findAll(
            {where: {created_by: res.locals.user.id}}
        )
            .then(room => {
                if (room == null) {
                    res.status(msg.NOT_FOUND.code).send(msg.NOT_FOUND);
                    res.end();
                } else {
                    res.status(msg.SUCCESSFUL.code).send(room);
                    res.end();
                }
            })
    },

    // decrypt digest to get room title
    getRoomTitle(req, res, next) {

    }

};
