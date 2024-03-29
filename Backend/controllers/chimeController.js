const AWS = require('aws-sdk');
const compression = require('compression');
const uuid = require('uuid/v4');
const log = require('../utils/logger');
const messages = require('../utils/messages');
const roomController = require('./roomController');

const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

const meetingCache = {};
const attendeeCache = {};

module.exports = {
    // join meeting
    // Todo: Authentication
    async joinMeeting(req, res, next){
        try {
            compression({})(req, res, () => {
            });
            const title = req.body.title;   // meeting digest
            const name = req.body.name;

            // check if meeting does not exists
            if (!meetingCache[title]) {
                meetingCache[title] = await chime
                    .createMeeting({
                        ClientRequestToken: uuid(),
                        // NotificationsConfiguration: {
                        //   SqsQueueArn: 'Paste your arn here',
                        //   SnsTopicArn: 'Paste your arn here'
                        // }
                    })
                    .promise();
                attendeeCache[title] = {};
            }
            const joinInfo = {
                JoinInfo: {
                    Title: title,
                    Meeting: meetingCache[title].Meeting,
                    Attendee: (
                        await chime
                            .createAttendee({
                                MeetingId: meetingCache[title].Meeting.MeetingId,
                                ExternalUserId: uuid(),
                            })
                            .promise()
                    ).Attendee,
                },
            };
            attendeeCache[title][joinInfo.JoinInfo.Attendee.AttendeeId] = {
                name,
                joining_time: new Date()
            };
            res.send(JSON.stringify(joinInfo));
            res.end();
        }
        catch (e) {
            log(e);
            log('Error in joinMeeting');
            res.status(messages.INTERNAL_SERVER_ERROR.code).send(JSON.stringify(e));
            res.end();
        }
    },

    // join meeting
    // Todo: Authentication
    async attendee(req, res, next) {
        try{
            compression({})(req, res, () => {});
            const attendeeInfo = {
                AttendeeInfo: {
                    AttendeeId: req.body.attendee,
                    Name: attendeeCache[req.body.title][req.body.attendee].name,
                },
            };
            res.send(JSON.stringify(attendeeInfo));
            res.end();
        }
        catch (e) {
            log(e);
            log('Error in attendee');
            res.status(messages.INTERNAL_SERVER_ERROR.code).send(JSON.stringify(e));
            res.end();
        }
    },

    async leaveMeeting(req, res, next){
        try{
            // Calculate active time in minutes
            let sessionTime = (new Date() - attendeeCache[req.body.meetingId][req.body.attendeeId].joining_time); // Get active time in ms
            sessionTime = Math.round(((sessionTime % 86400000) % 3600000) / 60000); // minutes

            // Pass values to controller
            roomController.updateActiveSessionTime(res.locals.user.id, req.body.meetingId, sessionTime);

            // Remove entry from cache
            delete attendeeCache[req.body.meetingId][req.body.attendeeId];

            res.send(messages.SUCCESSFUL_CREATE);
            res.end();
        }
        catch (e) {
            log(e);
            res.status(messages.INTERNAL_SERVER_ERROR.code).send(JSON.stringify(e));
            res.end();
        }
    }
};
