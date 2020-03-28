const models = require('../models');
const msg = require('../utils/messages');
const log = require('../utils/logger');
const validator = require('../utils/validator');
const crypto = require('../utils/crypto');

// Get env
const env = process.env.NODE_ENV || 'development';


module.exports = {

    // Create new room
    async create(req, res, next) {
        if (req.body.title) {

            // plaint text to encrypt
            let pt = req.body.title + '~~~' + res.locals.user.email;
            let ct = crypto.encrypt(pt);

            // check role for rights
            if (res.locals.user.role === 3) {
                res.status(msg.UNAUTHORIZED.code).send(msg.UNAUTHORIZED);
                return;
            }

            // check if room already exists
            models.Room.findOne(
                {where: {name: req.body.title, created_by: res.locals.user.id}}
            )
                .then(room => {
                    if (room != null) {
                        res.status(msg.ALREADY_EXIST.code).send(msg.ALREADY_EXIST);
                    } else {
                        // create room
                        models.Room.create({
                            name: req.body.title,
                            digest: ct,
                            created_by: res.locals.user.id,
                            is_active: true
                        })
                            .then(room => {
                                // add user in the room created
                                this.addUserToRoom(res.locals.user.id, room.dataValues.id)
                                    .then(msg => {
                                        res.status(msg.code).send(msg);
                                    })
                            })
                            .catch(error => {
                                if (env === 'development') {
                                    log(error);
                                }
                                res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
                            });
                    }
                })
                .catch(error => {
                    if (env === 'development') {
                        log(error);
                    }
                    res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
                });
        } else {
            res.status(msg.BAD_REQUEST.code).send(msg.BAD_REQUEST);
        }
    },


    // get all rooms info of currently logged in user (user info via jwt)
    getRoom(req, res, next) {
        models.Room.findAll(
            {where: {created_by: res.locals.user.id}, order: [['createdAt', 'DESC']], raw: true,}
        )
            .then(async (room) => {
                if (room == null) {
                    res.status(msg.NOT_FOUND.code).send(msg.NOT_FOUND);
                    res.end();
                } else {
                    for (x in room) {
                        room[x].attendee_count = await this.getAttendeeCountInRoom(room[x].id);
                        room[x].session = await this.getAttendeesSessionTime(room[x].id);
                    }
                    res.status(msg.SUCCESSFUL.code).send(room);
                    res.end();
                }
            })
            .catch(error => {
                if (env === 'development') {
                    log(error);
                }
                res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR)
            })
    },


    // add attendee to room API
    async addAttendeeToRoom(req, res, next) {
        models.Room.findOne(
            {where: {digest: req.body.digest}}
        )
            .then(room => {
                if (room) {
                    this.addUserToRoom(res.locals.user.id, room.dataValues.id)
                        .then(msg => {
                            res.status(msg.code).send(msg);
                        });
                }
            })
            .catch(error => {
                if (env === 'development') {
                    log(error);
                }
                return msg.INTERNAL_SERVER_ERROR;
            })
    },


    // add attendees to room
    async addUserToRoom(user_id, room_id) {
        if (!user_id || !room_id) {
            return msg.BAD_REQUEST;
        }
        return await models.User_Room.findOne({where: {user_id, room_id}})
            .then(user_room => {
                if (!user_room) {
                    models.User_Room.create({
                        user_id,
                        room_id,
                    });
                    return msg.SUCCESSFUL_CREATE;
                } else {
                    return msg.ALREADY_EXIST;
                }
            })
            .catch(error => {
                if (env === 'development') {
                    log(error);
                }
                return msg.INTERNAL_SERVER_ERROR;
            });
    },


    roomIsValid(req, res, next) {
        models.Room.findOne(
            {where: {digest: req.query.digest}}
        )
            .then(room => {
                if (!room) {
                    res.status(msg.NOT_FOUND.code).send(msg.NOT_FOUND);
                } else {
                    res.status(msg.SUCCESSFUL.code).send(msg.SUCCESSFUL);
                }
            })
            .catch(error => {
                if (env === 'development') {
                    log(error);
                }
                res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
            });
    },


    // Get attendee count in room
    getAttendeeCountInRoom(room_id) {
        return models.User_Room.count({
            where: {
                room_id: room_id
            },
        })
            .then(function (count) {
                // count is an integer
                return count;
            })
            .catch((error) => {
                if (env === 'development') {
                    log(error);
                }
                return 0;
            });
    },


    updateActiveSessionTime(user_id, digest, time) {

        digest = digest.replace(/%2F/g, '/').replace(/%2B/g, '+');

        models.Room.findOne({
            where: {digest},
            raw: true
        })
            .then(room => {

                models.User_Room.findOne({
                    where: {
                        user_id: user_id,
                        room_id: room.id
                    },
                    raw: true
                })
                    .then(user_sess => {

                        let timeTotal = time + user_sess.active_time;

                        models.User_Room.update(
                            {
                                active_time: timeTotal
                            },
                            {
                                where: {
                                    user_id: user_id,
                                    room_id: room.id
                                }
                            }
                        );

                    })
                    .catch(error => {
                        if (env === 'development') {
                            log(error);
                        }
                    });


            })
            .catch(error => {
                if (env === 'development') {
                    log(error);
                }
            });
    },


    getAttendeesSessionTime(room_id) {
        return models.User_Room.findAll({
            where: {
                room_id
            },
            include: [{
                model: models.User,
            }],
            raw: true
        })
            .then(user => {
                return user;
            })
            .catch(error => {
                if (env === 'development') {
                    log(error);
                }
                return {};
            });
    },
};


