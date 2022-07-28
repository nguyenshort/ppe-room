import {defineStore} from 'pinia'
import {IRomSpeaker, RoomItem, User} from "../models/room";
import {IAgoraRTCRemoteUser, ILocalTrack} from "agora-rtc-sdk-ng";

interface State {
    user?: User
    users: RoomItem[]
    pinner?: User
    speakers: IRomSpeaker[]
}

export const useRoomStore = defineStore('room', {
    // a function that returns a fresh state
    state: (): State => ({
        user: undefined,
        users: [],
        pinner: undefined,
        speakers: []
    }),
    // optional getters
    getters: {
        // Có user đang ghim
        hasPinner: (state) => (state.pinner || state.speakers.filter(speaker => speaker.level > 5).length) && state.users.length,
        listUsers: (state) => state.users.filter(user => user.user.id !== state.user?.id),
        talkers: (state) => state.speakers.filter(speaker => speaker.level > 5),
        talker: (state): User|undefined => {

            if (state.pinner) return state.pinner

            // Có người đang nói
            if(state.speakers.filter(speaker => speaker.level > 5).length) {

                // Người đầu tiên
                const uid = state.speakers.filter(speaker => speaker.level > 5)[0].uid

                if(uid === state.user?.id) return state.user

                const index = state.users.findIndex(user => user.user.id === uid)
                if (index > -1) {
                    return state.users[index].user
                }

            }

        }
    },
    // optional actions
    actions: {

        setUsers(users: RoomItem[]) {
            this.users = users
        },

        setUser(user?: User) {
            this.user = user
        },

        setPinner(user?: User) {
            this.pinner = user
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
                            name: 'Smileeye',
                            avatar: ''
                        }
                    })
                } else {
                    // Play the video
                    this.users.push({
                        uid: user.uid,
                        localVideoTrack: user.videoTrack as unknown as ILocalTrack,
                        user: {
                            id: user.uid,
                            name: 'Smileeye',
                            avatar: ''
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
