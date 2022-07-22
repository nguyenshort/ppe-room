import {IAgoraRTCClient, ILocalTrack} from "agora-rtc-sdk-ng";

export interface IUserRom {
    uid: string|number
    localAudioTrack?: ILocalTrack
    localVideoTrack?: ILocalTrack
}

export interface ILocalClient {
    localAudioTrack?: ILocalTrack
    localVideoTrack?: ILocalTrack
    client: IAgoraRTCClient
}
