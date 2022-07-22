<template>
  <div>
    <h1>Vite + Vue + Agora</h1>

    <div class="card">

      <div class="btns">

        <button type="button" @click="toggleRom">
          {{ agora.isCalling.value ? 'Thoát Phòng' : 'Vào Phòng' }}
        </button>
        <button v-if="agora.isCalling.value" type="button" @click="inviteUsers">
          Mời Bạn Bè
        </button>

      </div>


      <div class="user-id">ID của bạn: {{ uid }}</div>
      <div class="user-id">Chanel: video_meet</div>
    </div>

    <div class="container">
      <div ref="groups" class="groups-container">

        <video-call v-if="agora.isCalling.value" :uid="uid" :local-video-track="rtc.localVideoTrack" ></video-call>

        <video-call v-for="user in users" :key="user.uid" v-bind="user"></video-call>
      </div>

      <div class="logger">

        <div v-for="(log, index) in agora.logs.value" :key="index">
          {{ log }}
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'
import {makeid} from "../utils/random-string";
import VideoCall from "./VideoCall.vue"
import { getDatabase, ref as dbRef, onValue, set } from "firebase/database"
import useAgora from "../compositions/useAgora";

const uid = makeid(8)

const agora = useAgora()

// Users remote
const users = computed(() => agora.users.value)
const rtc = computed(() => agora.rtc)

const toggleRom = async () => {
  if (agora.users.value.length) {
    await agora.leave()
  } else {
    await agora.join('video_meet', uid)
    agora.publishedHandle()
    agora.unPublishedHandle()
  }
}

// Firbase
const countInvite = ref(0)
const inviteUsers = () => {
  set(dbRef(getDatabase(), 'rooms/video_meet'), {
    time: Date.now()
  });
}
const listenNotify = async () => {
  const starCountRef = dbRef(getDatabase(), 'rooms/video_meet');
  onValue(starCountRef, (snapshot) => {
    const data = snapshot.val();

    /**
     * Có dữ liệu => lời mời cũng đã được gửi | mới
     * Vừa vào có => tăng lên 1 ko có cũng tăng lkeen 1
     *
     */

    if (data && countInvite.value && !agora.users.value.length) {
      agora.logs.value.push(`Bạn được mời vào phòng`)
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

.logger {
  text-align: left;
}

.logger > div {
  margin-bottom: 10px;
}
</style>
