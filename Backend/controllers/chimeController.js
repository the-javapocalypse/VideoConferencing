const AWS = require('aws-sdk');
const compression = require('compression');
const uuid = require('uuid/v4');


const chime = new AWS.Chime({ region: 'us-east-1' });
chime.endpoint = new AWS.Endpoint('https://service.chime.aws.amazon.com/console');

const meetingCache = {};
const attendeeCache = {};


module.exports = {
    // join meeting
    async joinMeeting(req, res, next){
        compression({})(req, res, () => {});
        const title = 'demo';
        const name = 'a';

        meetingCache[title] = await chime
            .createMeeting({
                ClientRequestToken: uuid(),
                // NotificationsConfiguration: {
                //   SqsQueueArn: 'Paste your arn here',
                //   SnsTopicArn: 'Paste your arn here'
                // }
            })
            .promise();
        // check if meeting exists
        // if (!meetingCache[title]) {
        //     meetingCache[title] = await chime
        //         .createMeeting({
        //             ClientRequestToken: uuid(),
        //             // NotificationsConfiguration: {
        //             //   SqsQueueArn: 'Paste your arn here',
        //             //   SnsTopicArn: 'Paste your arn here'
        //             // }
        //         })
        //         .promise();
        //     attendeeCache[title] = {};
        // }
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
        console.log(joinInfo);
        attendeeCache[title][joinInfo.JoinInfo.Attendee.AttendeeId] = name;
        res.send(JSON.stringify(joinInfo));
        res.end();
    }
}
