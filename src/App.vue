<template>
  <div class="dark">
    <div class="bg-blue-50 dark:bg-slate-900">
      <div
          class="mx-auto min-h-screen bg-white dark:bg-slate-800 p-5"
          :class="{
            'flex items-center justify-center': !inRoom
          }"
      >
        <dynamic-layout v-if="inRoom" />
        <join-confirm v-else @join="inRoom = true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DynamicLayout from "./components/DynamicLayout.vue"
import {onMounted, ref} from "vue";
import JoinConfirm from "./components/JoinConfirm.vue";
import {useRoomStore} from "./stores/room";
import {IAgoraRTCRemoteUser} from "agora-rtc-sdk-ng";
import {useRTC} from "./compositions/useRTC";
import {IUserRom, RoomItem} from "./models/room";

const inRoom = ref(false)

const roomStore = useRoomStore()

const rtc = useRTC()

const addListeners = () => {
  rtc.client.on("user-published", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
    await rtc.client.subscribe(user, mediaType)
    await roomStore.publishedHandle(user, mediaType)

  })

  rtc.client.on("user-unpublished", async (user: IAgoraRTCRemoteUser, mediaType: "audio" | "video") => {
    // await rtc.client.unsubscribe(user, mediaType)
   //  await roomStore.unPublishedHandle(user)
    await roomStore.publishedHandle(user, mediaType)
  })

  rtc.client.on('user-left',(user: IAgoraRTCRemoteUser) => {
    const _users = roomStore.users.filter(item => item.uid !== user.uid)
    roomStore.setUsers(_users as RoomItem[])
  })
}

onMounted(() => addListeners())
</script>
