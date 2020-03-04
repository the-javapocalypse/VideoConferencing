// Util to send email

const nodemailer = require('nodemailer');
const log = require('./logger');

module.exports = {
    send: function (email, subject, body) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'k152123@nu.edu.pk',
                pass: 'cs495@li'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        var mailOptions = {
            from: 'k152123@nu.edu.pk',
            to: email,
            subject: subject,
            text: body
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                log('Error when sending email: ' + error);
                return false;
            } else {
                log('Email sent: ' + info.response);
                return true;
            }
        });
    }
}
