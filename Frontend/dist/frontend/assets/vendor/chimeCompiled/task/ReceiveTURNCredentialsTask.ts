// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import AudioVideoControllerState from '../audiovideocontroller/AudioVideoControllerState';
import MeetingSessionTURNCredentials from '../meetingsession/MeetingSessionTURNCredentials';
import Versioning from '../versioning/Versioning';
import BaseTask from './BaseTask';

/*
 * [[ReceiveTURNCredentialsTask]] asynchronously retrieves TURN credentials.
 */
export default class ReceiveTURNCredentialsTask extends BaseTask {
  protected taskName = 'ReceiveTURNCredentialsTask';

  private url: string;
  private meetingId: string;
  private joinToken: string;
  private cancelPromise: (error: Error) => void;

  constructor(private context: AudioVideoControllerState) {
    super(context.logger);
    this.url = context.meetingSessionConfiguration.urls.turnControlURL;
    this.meetingId = context.meetingSessionConfiguration.meetingId;
    this.joinToken = context.meetingSessionConfiguration.credentials.joinToken;
  }

  cancel(): void {
    const error = new Error(`canceling ${this.name()}`);
    this.cancelPromise && this.cancelPromise(error);
  }

  async run(): Promise<void> {
    const options: RequestInit = {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/json',
        'X-Chime-Auth-Token': '_aws_wt_session=' + this.joinToken,
      },
      redirect: 'follow',
      referrer: 'no-referrer',
      body: JSON.stringify({ meetingId: this.meetingId }),
    };

    this.context.logger.info(`requesting TURN credentials from ${this.url}`);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const responseBodyJson = await new Promise<any>(async (resolve, reject) => {
      this.cancelPromise = (error: Error) => {
        reject(error);
      };

      try {
        const responseBody = await fetch(Versioning.urlWithVersion(this.url), options);
        this.context.logger.info(`received TURN credentials`);
        resolve(await responseBody.json());
      } catch (error) {
        reject(error);
      }
    });

    this.context.turnCredentials = new MeetingSessionTURNCredentials();
    this.context.turnCredentials.password = responseBodyJson.password;
    this.context.turnCredentials.ttl = responseBodyJson.ttl;
    this.context.turnCredentials.uris = responseBodyJson.uris;
    this.context.turnCredentials.username = responseBodyJson.username;
  }
}
