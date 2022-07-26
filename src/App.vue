<template>
  <div class="dark">
    <div class="bg-blue-50 dark:bg-slate-900">
      <div
          class="mx-auto min-h-screen bg-white dark:bg-slate-800 px-5 py-5"
          :class="{
            'flex items-center justify-center': !inRoom
          }"
      >
        <dynamic-layout v-if="inRoom" />
        <join-confirm v-else @join="onJoin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DynamicLayout from "./components/DynamicLayout.vue"
import {onMounted, reactive, ref} from "vue";
import JoinConfirm from "./components/JoinConfirm.vue";
import {useRoomStore} from "./stores/room";
import agora, {IAgoraRTCClient, IAgoraRTCRemoteUser, ILocalTrack} from "agora-rtc-sdk-ng";
import {faker} from "@faker-js/faker";

const inRoom = ref(false)

const roomStore = useRoomStore()

const client = agora.createClient({mode: "rtc", codec: "vp8"})

const uid = faker.datatype.number({min: 0, max: 1000000})

const onJoin = async () => {

  await client.join("6bc0bf7f3e364153ba533fd765fb9c60", "smileeye", null, uid)

  console.log(`============== Join: ${uid} ==============`)


  await roomStore.join(uid)

  await client.publish([roomStore.rtc.localVideoTrack, roomStore.rtc.localAudioTrack] as ILocalTrack[])

  inRoom.value = true
}

const addListeners = () => {
  client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
    await client.subscribe(user, mediaType)

    console.log(`============== Subscribe: ${user.uid} ==============`)

    await roomStore.publishedHandle(user, mediaType)

  })

  client.on("user-unpublished", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
    await client.unsubscribe(user, mediaType)

    console.log(`============== Unsubscribe: ${user.uid} ==============`)

    await roomStore.unPublishedHandle(user)
  })
}

onMounted(() => addListeners())

</script>
