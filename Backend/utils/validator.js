// Util to validate data

const niv  = require('node-input-validator');
const models = require('../models/index');
const log = require('./logger');



module.exports = {
    createUser: function (req) {
        // Validate request
        niv.extend('unique', async ({ value, args }) => {
            // Check if email exists
            let emailExist = await models.User.findOne({where: {email: value}});
            // email already exists
            if (emailExist) {
                return false;
            }
            return true;
        });
        const v = new niv.Validator(req.body, {
            name: 'required',
            email: 'required|email|unique:User',
            password: 'required',
        });
        return v;
    }
}
