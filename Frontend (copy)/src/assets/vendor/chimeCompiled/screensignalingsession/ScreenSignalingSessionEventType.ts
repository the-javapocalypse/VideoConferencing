// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

export enum ScreenSignalingSessionEventType {
  Close = 'close',
  StreamStart = 'streamstart',
  StreamEnd = 'streamend',
  StreamSwitch = 'streamswitch',
  Heartbeat = 'heartbeat',
}

export default ScreenSignalingSessionEventType;
