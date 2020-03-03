const models = require('../models');
const msg = require('../utils/messages');
const log = require('../utils/logger');
const bcrypt = require('bcryptjs');
const validator = require('../utils/validator');
const mailer = require('../utils/mailer');
const UIDGenerator = require('uid-generator');


const jwtSecret = require('../config/jwtConfig').jwtSecret;
const jwt = require('jsonwebtoken');


module.exports = {

    // Create basic user
    create(req, res) {
        log('Creating User');

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
            const uidgen = new UIDGenerator(512);


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
                    }).then(user => {
                        // Send email for verification
                        let subject = 'Email Verification | ' + process.env.AppName;
                        let body = 'Dear user, Thank you for registering with Syscon. To activate your account, please click ' +
                            'on the following link: https://' + process.env.ClientDomain + '/activate/' + token;
                        mailer.send(req.body.email, subject, body);
                        res.status(msg.SUCCESSFUL_CREATE.code).send(msg.SUCCESSFUL_CREATE);
                    });
                });

        });

    },


    //login method
    login(req, res) {
        // Log request
        log('Login user request');
        // Get user by email
        models.User.findOne(
            {where: {email: req.body.email}}
        ).then(user => {
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

                    // Generate token to verify user email
                    const uidgen = new UIDGenerator(512);


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
                        });

                    // // user data present and user is active
                    // const token = jwt.sign(
                    //     {
                    //         email: user.email,
                    //         name: user.name,
                    //         role: user.role
                    //     }, jwtSecret);
                    //
                    // // User info to send
                    // const UserInfo = {
                    //     id: user.id,
                    //     name: user.name,
                    //     email: user.email,
                    //     role: user.role,
                    // };
                    // res.status(msg.SUCCESSFUL.code).send({
                    //     auth: true,
                    //     token: token,
                    //     user: UserInfo,
                    //     message: 'Successfully Logged in',
                    // });
                } else {
                    // Passwords don't match
                    res.status(msg.AUTHENTICATION_FAILED.code).send(msg.AUTHENTICATION_FAILED);
                }
            });
        })
            .catch(err => {
                log('Error in finding user when logging in');
                res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
            });
    },

    // Activate User
    activate(req, res) {
        // Log request
        log('Activate user request');

        // Refresh token
        const uidgen = new UIDGenerator(512);
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
                    .catch(err => {
                            res.status(msg.AUTHENTICATION_FAILED.code).send(msg.AUTHENTICATION_FAILED);
                        }
                    )
            });


    },
};
