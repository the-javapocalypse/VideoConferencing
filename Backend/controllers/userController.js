const models = require('../models');
const msg = require('../utils/messages');
const log = require('../utils/logger');
const bcrypt = require('bcryptjs');
const validator = require('../utils/validator');
const mailer = require('../utils/mailer');
const UIDGenerator = require('uid-generator');


module.exports = {

    // Create basic user
    create(req, res){
        log('Creating User');

        // Validate request
        let validate = validator.createUser(req);
        validate.check().then((matched) => {
            if (!matched) {
                // Send error in response if invalid data
                res.status(msg.BAD_REQUEST.code).send(validate.errors);
                res.end()
            }
            // If data is valid proceed

            // Hash password
            const hash = bcrypt.hashSync(req.body.password, 10);

            // Generate token to verify user email
            const uidgen = new UIDGenerator(256);
            let token = uidgen.generateSync();

            // Create User
            models.User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
                role: 2,
                token: token,
                is_active: false
            }).then( user => {
                // Send email for verification
                let subject = 'Email Verification | ' + process.env.AppName;
                let body = 'Dear user, Thank you for registering with Syscon. To activate your account, please click ' +
                    'on the following link: https://' + process.env.ClientDomain + '/activate/' + token;
                mailer.send(req.body.email, subject, body);
                res.status(msg.SUCCESSFUL_CREATE.code).send(msg.SUCCESSFUL_CREATE);
            });
        });

    }
};
