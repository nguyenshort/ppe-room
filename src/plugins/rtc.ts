import type { App } from 'vue'
import agora, {IAgoraRTCClient, ILocalTrack} from "agora-rtc-sdk-ng";

export const AGORA_CONSTANT = Symbol.for('agora')

export interface ILocalRTC {
    client: IAgoraRTCClient
    localAudioTrack?: ILocalTrack
    localVideoTrack?: ILocalTrack
}

const plugin = {
    install(app: App) {

        const client = agora.createClient({
            codec: 'h264',
            mode: 'rtc'
        })

        app.provide<ILocalRTC>(AGORA_CONSTANT, {
            client
        })
    }
}

export default plugin
