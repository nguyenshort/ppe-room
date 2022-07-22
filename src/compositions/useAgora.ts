import {reactive, ref} from "vue";
import {ILocalClient, IUserRom} from "../types/agoda";
import AgoraRTC, {IAgoraRTCRemoteUser, ILocalTrack} from "agora-rtc-sdk-ng";

/**
 * @link https://docs.agora.io/en/Video/start_call_web_ng?platform=Web
 */
export default () => {

    const logs = ref<string[]>([])

    let rtc: ILocalClient = {
        client: AgoraRTC.createClient({mode: "rtc", codec: "vp8"}),
    };

    const isCalling = ref(false)

    // Danh sách users trong phòng...ngoại trừ chính mình
    const users = ref<IUserRom[]>([])

    const join = async (chanel: string, uid: string) => {

        await rtc.client.join("6bc0bf7f3e364153ba533fd765fb9c60", "video_meet", null, uid)
        logs.value.push(`Join channel: ${chanel} with uid: ${uid}`)

        rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        // Create a local video track from the video captured by a camera.
        rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        // Publish the local audio and video tracks to the RTC channel.
        await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);
        logs.value.push(`Publish local audio and video tracks to the RTC channel`)

        logs.value.push(`Publish local tracks: ${rtc.localAudioTrack.getTrackId()} and ${rtc.localVideoTrack.getTrackId()}`)

        isCalling.value = true

    }

    const leave = async () => {
        // Destroy the local audio and video tracks.
        rtc.localAudioTrack?.close()
        rtc.localVideoTrack?.close()

        for (const user of users.value) {

            if (user.localVideoTrack) {
                logs.value.push(`Stop video track: ${user.uid}`)
                user.localVideoTrack.stop()
                user.localAudioTrack?.close()
            }
            if (user.localAudioTrack) {
                logs.value.push(`Stop audio track: ${user.uid}`)
                user.localAudioTrack.stop()
                user.localAudioTrack.close()
            }
        }

        rtc.client.off("user-published", publishedHandle)
        users.value = []

        await rtc.client.leave()
    }

    const publishedHandle = () => {
        rtc.client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
            logs.value.push(`User ${user.uid} published ${mediaType} track`)
            // Initiate the subscription
            await rtc.client.subscribe(user, mediaType);
            // If the subscribed track is an audio track

            const _index = users.value.findIndex(u => u.uid === user.uid)
            if (_index === -1) {

                if (mediaType === "audio") {
                    users.value.push({
                        uid: user.uid,
                        localAudioTrack: user.audioTrack as unknown as ILocalTrack
                    })
                } else {
                    // Play the video
                    users.value.push({
                        uid: user.uid,
                        localVideoTrack: user.videoTrack as unknown as ILocalTrack
                    })
                }

            } else {
                if (mediaType === "audio") {
                    users.value[_index].localAudioTrack = user.audioTrack as unknown as ILocalTrack
                } else {
                    users.value[_index].localVideoTrack = user.videoTrack as unknown as ILocalTrack
                }
            }
        })
    }

    const unPublishedHandle = () => {
        rtc.client.on("user-unpublished", (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
            logs.value.push(`Remove user: ${user.uid} with media type: ${mediaType}`)
            users.value = users.value.filter(item => item.uid !== user.uid)
        })
    }

    return {
        logs,
        isCalling,
        rtc,
        users,
        join,
        leave,
        publishedHandle,
        unPublishedHandle
    }

}
