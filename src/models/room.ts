// Thông tin user để hiển thị trên màn hình
import {IAgoraRTCClient, ILocalTrack, UID} from "agora-rtc-sdk-ng";

export interface User {
    id: string|number
    name: string
    avatar: string
}

// Props
export interface RoomItem {
    uid: string|number
    user: User
    localAudioTrack?: ILocalTrack
    localVideoTrack?: ILocalTrack
}

export interface IUserRom {
    uid: string|number
    localAudioTrack?: ILocalTrack
    localVideoTrack?: ILocalTrack
}

export interface ILocalClient {
    uid?: string|number
    user?: User
    localAudioTrack?: ILocalTrack
    localVideoTrack?: ILocalTrack
    client?: IAgoraRTCClient
}

export interface IRomSpeaker {
    uid: UID
    level: number
}

