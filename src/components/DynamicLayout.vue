<template>
  <div ref="el" class="dynamic-layout h-full relative overflow-hidden max-w-screen w-full animation">

    <!-- List các user -->

    <template v-if="roomStore.hasPinner">
      <audience-list />
      <presenter-badge />
    </template>

    <div
        class="grid dynamic-grid overflow-y-auto scrollbar-hide relative z-10"
        :class="{
          _on_pinner: roomStore.hasPinner,
        }"
    >

      <!-- Current User-->
      <user-media-wrapper
          v-bind="{
            current: true,
            item: currentUser
          }"
      />

      <user-media-wrapper
          v-for="(item, index) in roomStore.users"
          :key="index"
          :item="item"
      ></user-media-wrapper>

    </div>

    <layout-controls />

  </div>
</template>

<script lang="ts" setup>
import {useRoomStore} from "../stores/room"
import AudienceList from "./AudienceList.vue"
import PresenterBadge from "./PresenterBadge.vue"
import {computed, onMounted} from "vue"
import {useWindowSize} from "@vueuse/core";
import UserMediaWrapper from "./UserMediaWrapper.vue";
import {useRTC} from "../compositions/useRTC";
import LayoutControls from "./LayoutControls.vue";

const roomStore = useRoomStore()

const rtc = useRTC()

const currentUser = computed(() => ({
  uid: roomStore.user?.id || '',
  user: roomStore.user,
  localAudioTrack: rtc.localAudioTrack,
  localVideoTrack: rtc.localVideoTrack,
}))

const { width, height } = useWindowSize()

const aspect = computed(() => {
  // Todo: fix aspect ratio
  return width.value / (height.value - 25)
})


const listenVolume = () => {
  rtc.client.enableAudioVolumeIndicator()

  /**
   * Sự kiện bắn ra 2 giây 1 lần...bất kể user có dg nói hay không
   */
  rtc.client.on("volume-indicator", (volumes) => {

    volumes.forEach((volume) => {
      roomStore.upsertSpeaker(volume)
    })

  })
}

onMounted(() => listenVolume())

</script>

<style>

.dynamic-layout {
  /*max-height: calc(100vh - 1.25rem - 1.25rem)*/
}

.dynamic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-gap: 15px;
  max-height: 100%;
}

.item._talking {
  border-color: #3b66f5 !important;
}

.item-fill {
  @apply absolute top-0 left-0 w-full h-full
}
.animation {
  @apply transition duration-300 ease-in-out
}

.item {
  @apply relative overflow-hidden rounded-md dark:border-slate-900 dark:bg-slate-900 cursor-pointer
}

.item {
  aspect-ratio: v-bind(aspect);
}

.item.active {
  grid-column: 1/-1;
}

.dynamic-grid._on_pinner {
/*  position: absolute;
  width: 120px;
  right: 0;*/
}

.dynamic-grid._on_pinner .item.active {
  order: 0;
  display: block;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 1.25rem - 1.25rem);
}

.dynamic-grid._on_pinner .item {
  order: 1;
  display: none;
}
/*Fix size*/

.dynamic-grid._on_pinner .item.active ._has_tranform {
  transform: translateX(-70px);
}

.dynamic-grid._on_pinner .item.active ._auto_avatar {
  display: none;
}
.dynamic-grid._on_pinner .item.active:hover ._auto_avatar {
  display: block;
}

</style>
