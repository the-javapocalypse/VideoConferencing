const models = require('../models');
const msg = require('../utils/messages');
const log = require('../utils/logger');
const bcrypt = require('bcryptjs');
const validator = require('../utils/validator');
const mailer = require('../utils/mailer');
const UIDGenerator = require('uid-generator');

// Get env
const env = process.env.NODE_ENV || 'development';

// Jwt config
const jwtSecret = require('../config/jwtConfig').jwtSecret;
const jwt = require('jsonwebtoken');

// Token generators
const uidgen = new UIDGenerator(512);
const uidgen128 = new UIDGenerator(128);


module.exports = {

    // register user with role 2
    create(req, res) {
        // Validate request
        let validate = validator.createUser(req);
        validate.check().then((matched) => {
            if (!matched) {
                // Send error in response if invalid data
                res.status(msg.BAD_REQUEST.code).send(validate.errors);
                res.end();
                return;
            }
            // If data is valid proceed

            // Hash password
            const hash = bcrypt.hashSync(req.body.password, 10);
            // Generate token to verify user email

            // Async generate token
            uidgen.generate()
                .then(token => {
                    // Create User
                    models.User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        role: 2,
                        token: token,
                        is_active: false
                    })
                        .then(user => {
                            // Send email for verification
                            let subject = 'Email Verification | ' + process.env.AppName;
                            let body = 'Dear user, Thank you for registering with Syscon. To activate your account, please click ' +
                                'on the following link: https://' + process.env.ClientDomain + '/activate/' + token;
                            mailer.send(req.body.email, subject, body);
                            res.status(msg.SUCCESSFUL_CREATE.code).send(msg.SUCCESSFUL_CREATE);
                        })
                        .catch(error => {
                            if (env === 'development') {
                                log(error);
                            }
                            res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR)
                        });
                })
                .catch(error => {
                    if (env === 'development') {
                        log(error);
                    }
                    res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR)
                });


        });

    },


    //login method for registered user
    login(req, res) {
        // Get user by email
        models.User.findOne(
            {where: {email: req.body.email}}
        )
            .then(user => {
                // Check if record exists
                if (user == null) {
                    res.status(msg.AUTHENTICATION_FAILED.code).send(msg.AUTHENTICATION_FAILED);
                    res.end();
                    return;
                }
                // Check password
                bcrypt.compare(req.body.password, user.password, function (err, user_auth) {
                    // if authenticated
                    if (user_auth) {
                        // Check if user is activated
                        if (!user.is_active) {
                            res.status(msg.NOT_ACTIVE.code).send(msg.NOT_ACTIVE);
                            return;
                        }


                        // Async generate token
                        uidgen.generate()
                            .then(token => {
                                // Get user by token
                                models.User.update(
                                    {
                                        token: token,
                                    },
                                    {where: {email: user.email}}
                                );

                                // user data present and user is active
                                const jwtToken = jwt.sign(
                                    {
                                        token: token
                                    }, jwtSecret);

                                // User info to send
                                const UserInfo = {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    role: user.role,
                                };
                                res.status(msg.SUCCESSFUL.code).send({
                                    auth: true,
                                    token: jwtToken,
                                    user: UserInfo,
                                    message: 'Successfully Logged in',
                                });
                            })
                            .catch(error => {
                                if (env === 'development') {
                                    log(error);
                                }
                                res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR)
                            });
                    } else {
                        // Passwords don't match
                        res.status(msg.AUTHENTICATION_FAILED.code).send(msg.AUTHENTICATION_FAILED);
                    }
                });
            })
            .catch(error => {
                if (env === 'development') {
                    log(error);
                }
                res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
            });
    },

    // Activate user account via email confirmation
    activate(req, res) {
        // Refresh token
        uidgen.generate()
            .then(token => {
                // Get user by token
                models.User.update(
                    {
                        is_active: true,
                        token: token,
                    },
                    {where: {token: req.params.token}}
                )
                    .then(result => {
                            res.status(msg.SUCCESSFUL_UPDATE.code).send(msg.SUCCESSFUL_UPDATE);
                        }
                    )
                    .catch(error => {
                            if (env === 'development') {
                                log(error);
                            }
                            res.status(msg.AUTHENTICATION_FAILED.code).send(msg.AUTHENTICATION_FAILED);
                        }
                    );
            })
            .catch(error => {
                    if (env === 'development') {
                        log(error);
                    }
                    res.status(msg.AUTHENTICATION_FAILED.code).send(msg.AUTHENTICATION_FAILED);
                }
            );

    },


    // create visitor/attendee to use system without logging in (with role 3)
    createAttendee(req, res, next) {
        // Validate request
        let validate = validator.createAttendee(req);
        validate.check().then((matched) => {
            if (!matched) {
                // Send error in response if invalid data
                res.status(msg.BAD_REQUEST.code).send(validate.errors);
                res.end();
                return;
            }
            // If data is valid proceed

            // Hash email + datetime to create password (since a attendee, wont be logging in)
            const hash = bcrypt.hashSync(req.body.email + new Date().toLocaleTimeString(), 10);

            // Async generate token
            uidgen128.generate()
                .then(token => {
                    // Create User
                    models.User.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash,
                        role: 3,    // attendee
                        token: token,
                        is_active: true     // no login required
                    })
                        .then(user => {
                            res.status(msg.SUCCESSFUL_CREATE.code).send(msg.SUCCESSFUL_CREATE);
                        })
                        .catch(error => {
                            if (env === 'development') {
                                log(error);
                            }
                            res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
                        });
                })
                .catch(error => {
                    if (env === 'development') {
                        log(error);
                    }
                    res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
                });

        });

    },


    // login attendee (no password required, role is 3)
    loginAttendee(req, res, next) {
        // Get user by email
        models.User.findOne(
            {where: {email: req.body.email, role: 3}}
        )
            .then(user => {
                // Check if record exists
                if (user == null) {
                    res.status(msg.AUTHENTICATION_FAILED.code).send(msg.AUTHENTICATION_FAILED);
                    res.end();
                    return;
                }

                // Async generate token
                uidgen.generate()
                    .then(token => {
                        // Get user by token
                        models.User.update(
                            {
                                token: token,
                            },
                            {where: {email: user.email}}
                        );

                        // user data present and user is active
                        const jwtToken = jwt.sign(
                            {
                                token: token
                            }, jwtSecret);

                        // User info to send
                        const UserInfo = {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role,
                        };
                        res.status(msg.SUCCESSFUL.code).send({
                            auth: true,
                            token: jwtToken,
                            user: UserInfo,
                            message: 'Successfully Logged in',
                        });
                    })
                    .catch(error => {
                        if (env === 'development') {
                            log(error);
                        }
                        res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
                    });
            })
            .catch(error => {
                if (env === 'development') {
                    log(error);
                }
                res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
            });
    },



    logout (req, res, next) {
        models.User.findOne(
            {where: {email: res.locals.user.email}}
        )
            .then(user => {
                if (user){
                    user.update({
                        token: ''
                    }).then(succ => {
                        res.status(msg.SUCCESSFUL.code).send(msg.SUCCESSFUL)
                    })
                }else{
                    res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR)
                }
            })
            .catch(error => {
                if (env === 'development') {
                    log(error);
                }
                res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR)
            })
    },


    contactForm(req, res, next){
        try{
            let receiver = ['muneeb@syscrypt.co.uk', 'imran@attribes.co.uk', 'ali@syscrypt.co.uk'];
            let body = 'Form submitted by: ' + req.name + ' (' + req.email + '). Body: ' + req.message;
            receiver.forEach( email => {
                mailer.send(email, 'Syson | Website Contact Form', body);
            });
            res.status(msg.SUCCESSFUL.code).send(msg.SUCCESSFUL);
        }
        catch (e) {
            if (env === 'development') {
                log(e);
            }
            res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
        }
    }



};
