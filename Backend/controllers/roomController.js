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

            // check role for rights
            if (res.locals.user.role === 3) {
                res.status(msg.UNAUTHORIZED.code).send(msg.UNAUTHORIZED);
                return;
            }



            // create room
            models.Room.create({
                name: req.body.title,
                digest: ct,
                created_by: res.locals.user.id,
                is_active: true
            })
                .then(room => {
                    // add user in the room created
                    this.addUserToRoom(res.locals.user.id, room.dataValues.id);
                    res.status(msg.SUCCESSFUL.code).send(msg.SUCCESSFUL);
                })
                .catch(error => {
                    console.log(error);
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


    // add attendee to room API
    addAttendeeToRoom(req, res, next) {
        this.addUserToRoom(res.locals.user.id, req.body.room_id);
        res.status(msg.SUCCESSFUL.code).send(msg.SUCCESSFUL);
    },

    // add attendees to room
    addUserToRoom(user_id, room_id) {
        models.User_Room.create({
            user_id,
            room_id,
        });
    }

};
