const models = require('../models');
const msg = require('../utils/messages');
const log = require('../utils/logger');
const UIDGenerator = require('uid-generator');

// Get env
const env = process.env.NODE_ENV || 'development';


module.exports = {
    create(req, res, next) {
        models.Covid.create(req.body)
            .then((covid) => {
                    res.status(msg.SUCCESSFUL_CREATE).send(msg.SUCCESSFUL_CREATE);
                }
            )
            .catch(error => {
                if (env === 'development') {
                    log(error);
                }
                res.status(msg.INTERNAL_SERVER_ERROR.code).send(msg.INTERNAL_SERVER_ERROR);
            });
    }
}
