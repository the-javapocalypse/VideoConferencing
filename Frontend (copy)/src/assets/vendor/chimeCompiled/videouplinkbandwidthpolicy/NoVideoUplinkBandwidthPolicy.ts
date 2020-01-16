// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import DefaultVideoCaptureAndEncodeParameter from '../videocaptureandencodeparameter/DefaultVideoCaptureAndEncodeParameter';
import VideoCaptureAndEncodeParameter from '../videocaptureandencodeparameter/VideoCaptureAndEncodeParameter';
import VideoStreamIndex from '../videostreamindex/VideoStreamIndex';
import VideoUplinkBandwidthPolicy from '../videouplinkbandwidthpolicy/VideoUplinkBandwidthPolicy';

export default class NoVideoUplinkBandwidthPolicy implements VideoUplinkBandwidthPolicy {
  constructor() {}
  updateIndex(_videoIndex: VideoStreamIndex): void {}
  wantsResubscribe(): boolean {
    return false;
  }
  chooseCaptureAndEncodeParameters(): VideoCaptureAndEncodeParameter {
    return new DefaultVideoCaptureAndEncodeParameter(0, 0, 0, 0, false);
  }
  maxBandwidthKbps(): number {
    return 0;
  }
  setIdealMaxBandwidthKbps(_idealMaxBandwidthKbps: number): void {}
  setHasBandwidthPriority(_hasBandwidthPriority: boolean): void {}
}
