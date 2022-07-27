import {defineStore} from 'pinia'
import {ILocalClient, IRomSpeaker, RoomItem} from "../models/room";
import {IAgoraRTCRemoteUser, ILocalTrack} from "agora-rtc-sdk-ng";
import {faker} from "@faker-js/faker";
import agora from 'agora-rtc-sdk-ng'

interface State {
    users: RoomItem[]
    pinner?: RoomItem
    rtc: ILocalClient
    onCalling: boolean
    speakers: IRomSpeaker[]
}

export const useRoomStore = defineStore('room', {
    // a function that returns a fresh state
    state: (): State => ({
        users: [],
        pinner: undefined,
        rtc: {
            localAudioTrack: undefined,
            localVideoTrack: undefined,
            user: undefined
        },
        onCalling: false,
        speakers: []
    }),
    // optional getters
    getters: {
        hasPinner: (state) => (!!state.pinner || state.speakers.filter(speaker => speaker.level > 5).length) && state.users.length,
        listUsers: (state) => state.users.filter(user => user.user.id !== state.pinner?.user.id),
        talkers: (state) => state.speakers.filter(speaker => speaker.level > 5),
    },
    // optional actions
    actions: {

        setUsers(users: RoomItem[]) {
            this.users = users
        },

        async join(uid: string|number) {
            const localAudioTrack = await agora.createMicrophoneAudioTrack();
            // Create a local video track from the video captured by a camera.
            const localVideoTrack = await agora.createCameraVideoTrack();
            // Publish the local audio and video tracks to the RTC channel.
            this.rtc.localAudioTrack = localAudioTrack
            this.rtc.localVideoTrack = localVideoTrack

            this.rtc.user = {
                id: uid,
                name: faker.name.findName(),
                avatar: faker.image.avatar()
            }

            this.onCalling = true
        },

        togglePinner(item?: RoomItem) {

            if (this.pinner?.user?.id === item?.user.id) {
                this.pinner = undefined
            } else {
                this.pinner = item
            }
        },

        async publishedHandle(user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") {
            const _index = this.users.findIndex(u => u.uid === user.uid)
            if (_index === -1) {

                if (mediaType === "audio") {
                    this.users.push({
                        uid: user.uid,
                        localAudioTrack: user.audioTrack as unknown as ILocalTrack,
                        user: {
                            id: user.uid,
                            name: faker.name.findName(),
                            avatar: faker.image.avatar()
                        }
                    })
                } else {
                    // Play the video
                    this.users.push({
                        uid: user.uid,
                        localVideoTrack: user.videoTrack as unknown as ILocalTrack,
                        user: {
                            id: user.uid,
                            name: faker.name.findName(),
                            avatar: faker.image.avatar()
                        }
                    })
                }

            } else {
                if (mediaType === "audio") {
                    this.users[_index].localAudioTrack = user.audioTrack as unknown as ILocalTrack
                } else {
                    this.users[_index].localVideoTrack = user.videoTrack as unknown as ILocalTrack
                }
            }
        },

        unPublishedHandle(user: IAgoraRTCRemoteUser) {
            this.users = this.users.filter(item => item.uid !== user.uid)
        },

        async leave() {
            // Destroy the local audio and video tracks.
            if (this.rtc.localAudioTrack) {
                this.rtc.localVideoTrack?.stop()
                this.rtc.localAudioTrack.close()
            } else {
                this.rtc.localVideoTrack?.stop()
                this.rtc.localVideoTrack?.close()
            }

            this.users = []
        },

        upsertSpeaker(speaker: IRomSpeaker) {
            const _index = this.speakers.findIndex(s => s.uid === speaker.uid)
            if (_index === -1) {
                this.speakers.push(speaker)
            } else {
                this.speakers[_index] = speaker
            }
        }

    },
})
