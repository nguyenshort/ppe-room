<template>
  <button class="bg-blue-600 px-3 py-3 rounded-full text-white" @click="toggleMic">

    <svg v-if="mediaStatus.mic" width="20px" height="20px" class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M192 448h128M384 208v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32M256 368v80"/><path d="M256 64a63.68 63.68 0 00-64 64v111c0 35.2 29 65 64 65s64-29 64-65V128c0-36-28-64-64-64z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/></svg>

    <svg v-else width="20px" height="20px" class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-miterlimit="10" stroke-width="32" d="M432 400L96 64"/><path d="M400 240v-31.55c0-8.61-6.62-16-15.23-16.43A16 16 0 00368 208v32a111.58 111.58 0 01-2.45 23.31 4.05 4.05 0 001.07 3.69l21.82 21.81a2 2 0 003.29-.72A143.27 143.27 0 00400 240zM256 352a112.36 112.36 0 01-112-112v-31.55c0-8.61-6.62-16-15.23-16.43A16 16 0 00112 208v32c0 74 56.1 135.12 128 143.11V432h-47.55c-8.61 0-16 6.62-16.43 15.23A16 16 0 00192 464h127.55c8.61 0 16-6.62 16.43-15.23A16 16 0 00320 432h-48v-48.89a143.08 143.08 0 0052-16.22 4 4 0 00.91-6.35L307 342.63a4 4 0 00-4.51-.78A110.78 110.78 0 01256 352zM256 80a47.18 47.18 0 0148 48v74.72a4 4 0 001.17 2.82L332.59 233a2 2 0 003.41-1.42V128.91C336 85 301 48.6 257.14 48a79.66 79.66 0 00-68.47 36.57 4 4 0 00.54 5l19.54 19.54a2 2 0 003.25-.63A47.44 47.44 0 01256 80z"/><path d="M207.27 242.9L179.41 215a2 2 0 00-3.41 1.42V239a80.89 80.89 0 0023.45 56.9 78.55 78.55 0 0077.8 21.19 2 2 0 00.86-3.35l-24.91-24.91a4.08 4.08 0 00-2.42-1.15c-21.65-2.52-39.48-20.44-42.37-42.43a4 4 0 00-1.14-2.35z"/></svg>

  </button>
  <button class="bg-blue-600 px-3 py-3 rounded-full text-white ml-5" @click="toggleCam">

    <svg v-if="mediaStatus.cam" width="20px" height="20px" class="fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M374.79 308.78L457.5 367a16 16 0 0022.5-14.62V159.62A16 16 0 00457.5 145l-82.71 58.22A16 16 0 00368 216.3v79.4a16 16 0 006.79 13.08z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32"/><path d="M268 384H84a52.15 52.15 0 01-52-52V180a52.15 52.15 0 0152-52h184.48A51.68 51.68 0 01320 179.52V332a52.15 52.15 0 01-52 52z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>

    <svg v-else width="20px" height="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="32" stroke-linejoin="round" d="M374.79 308.78L457.5 367a16 16 0 0022.5-14.62V159.62A16 16 0 00457.5 145l-82.71 58.22A16 16 0 00368 216.3v79.4a16 16 0 006.79 13.08z"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="32" stroke-miterlimit="10" d="M50.19 140.57A51.94 51.94 0 0032 180v152a52.15 52.15 0 0052 52h184a51.6 51.6 0 0022-4.9M208 128h60.48A51.68 51.68 0 01320 179.52V248M416 416L80 80"/></svg>
  </button>

</template>

<script lang="ts" setup>

import {onMounted, reactive, watch} from "vue"
import {useRTC} from "../compositions/useRTC";

const rtc = useRTC()

const mediaStatus = reactive({
  mic: true,
  cam: true,
})

const emit = defineEmits<{
  (e: 'change', params: typeof mediaStatus): void
}>()


const toggleMic = async () => {
  mediaStatus.mic = !mediaStatus.mic
  await rtc.localAudioTrack?.setMuted(!mediaStatus.mic)
  emit('change', mediaStatus)
}

const toggleCam = async () => {
  mediaStatus.cam = !mediaStatus.cam
  await rtc.localVideoTrack?.setMuted(!mediaStatus.cam)
  emit('change', mediaStatus)
}

onMounted(() => {
  mediaStatus.cam = !rtc.localVideoTrack?.muted ?? true
  mediaStatus.mic = !rtc.localAudioTrack?.muted ?? true
})

</script>

<style scoped>

</style>
