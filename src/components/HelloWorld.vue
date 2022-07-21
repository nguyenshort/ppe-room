<template>
  <div>
    <h1>Vite + Vue + Agora</h1>

    <div class="card">

      <div class="btns">

        <button type="button" @click="toggleRom">
          {{ users.length ? 'Thoát Phòng' : 'Vào Phòng' }}
        </button>
        <button v-if="users.length" type="button" @click="inviteUsers">
          Mời Bạn Bè
        </button>

      </div>


      <div class="user-id">ID của bạn: {{ userID }}</div>
    </div>

    <div class="container">
      <div ref="groups" class="groups-container">
        <video-call v-for="user in users" :key="user.uid" v-bind="user" :user="userID" @logger="loggers.push($event)"></video-call>
      </div>

      <div class="logger">

        <div v-for="(log, index) in loggers" :key="index">
          {{ log }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {nextTick, onMounted, onUnmounted, ref} from 'vue'
import {useAgora} from "../compositions/useAgora";
import agora, {IAgoraRTCRemoteUser, ILocalTrack} from "agora-rtc-sdk-ng";
import {makeid} from "../utils/random-string";
import VideoCall from "./VideoCall.vue"
import { getDatabase, ref as dbRef, onValue, set } from "firebase/database";

const userID = ref(makeid(8));

const client = useAgora()

const loggers = ref<string[]>([])

interface IUserRom {
  uid: string|number
  localAudioTrack?: ILocalTrack
  localVideoTrack?: ILocalTrack
}

const users = ref<IUserRom[]>([])

const createAndJoin = async () => {

  client.on("user-published", trackPublished)

  client.on("user-unpublished", (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
    loggers.value.push(`Remove user: ${user.uid}`)
    users.value = users.value.filter(item => item.uid !== user.uid)
  })

  await client.join("6bc0bf7f3e364153ba533fd765fb9c60", "video_meet", null, userID.value);

  loggers.value.push(`Joined channel: video_meet`)


  const localAudioTrack = await agora.createMicrophoneAudioTrack()
  const localVideoTrack = await agora.createCameraVideoTrack()

  await configRoom(userID.value, { localAudioTrack, localVideoTrack })

}

/**
 * Kiểm tra user => đẩy vào mảng users
 */
type Options = {
  localAudioTrack?: ILocalTrack
  localVideoTrack?: ILocalTrack
}
const configRoom = async (uid: string|number, tracks: Options) => {

  const exist = users.value.findIndex(user => user.uid === uid)

  if (exist > -1) {
    // Đã tồn tại user
    // Bỏ qua
    return
  }

  const _tracks = []

  const _user: Partial<IUserRom> = {
    uid
  }

  if (tracks.localAudioTrack) {
    _tracks.push(tracks.localAudioTrack)
    _user.localAudioTrack = tracks.localAudioTrack
  }
  if (tracks.localVideoTrack) {
    _tracks.push(tracks.localVideoTrack)
    _user.localVideoTrack = tracks.localVideoTrack
  }

  // Đẩy lên server
  // @link: https://docs.agora.io/en/Video/start_call_web_ng?platform=Web
  await client.publish(_tracks)

  // Push vào mảng
  users.value.push({
    uid: uid,
    localVideoTrack: tracks.localVideoTrack
  })
}

const inviteUsers = () => {
  set(dbRef(getDatabase(), 'rooms/video_meet'), {
    time: Date.now()
  });
}


const trackPublished = async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
  // Initiate the subscription
  await client.subscribe(user, mediaType);

  loggers.value.push(`New user: ${user.uid}`)

  // If the subscribed track is an audio track
  if (mediaType === "audio") {
    // Bỏ qua
  } else {
    const videoTrack = user.videoTrack;
    // Play the video
    users.value.push({
      uid: user.uid,
      localVideoTrack: videoTrack as unknown as ILocalTrack
    })
  }
}



const leaveRoom = () => {
  client.leave()
  client.off("user-published", trackPublished)

  for (const user of users.value) {

    if (user.localVideoTrack) {
      loggers.value.push(`Stop video track: ${user.uid}`)
      user.localVideoTrack.stop()
      user.localAudioTrack?.close()
    }
    if (user.localAudioTrack) {
      loggers.value.push(`Stop audio track: ${user.uid}`)
      user.localAudioTrack.stop()
      user.localAudioTrack.close()
    }
  }

  users.value = []
}

const toggleRom = () => {
  if (users.value.length) {
    leaveRoom()
  } else {
    createAndJoin()
  }
}

onMounted(() => {

  loggers.value.push('Init with userID: ' + userID.value)

})



onUnmounted(() => {
  client.off("user-published", trackPublished)
  leaveRoom()
})



// Firbase
const countInvite = ref(0)
const listenNotify = async () => {
  const starCountRef = dbRef(getDatabase(), 'rooms/video_meet');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();

    /**
     * Có dữ liệu => lời mời cũng đã được gửi | mới
     * Vừa vào có => tăng lên 1 ko có cũng tăng lkeen 1
     *
     */

    console.log(data)

    if (data && countInvite.value && !users.value.length) {
      loggers.value.push(`Bạn được mời vào phòng`)
    }

    countInvite.value++

  });
}

onMounted(() => {
  listenNotify()
})

</script>

<style scoped>
.user-id {
  margin-top: 10px;
}

.groups-container {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  grid-gap: 25px;
}


.container {
  display: grid;
  grid-gap: 30px;
  grid-template-columns: 1fr 250px;
}

.btns > button + button {
  margin-left: 30px;
}
</style>
