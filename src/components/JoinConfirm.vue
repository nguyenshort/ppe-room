<template>

  <div class="overflow-hidden px-5 flex items-center">

    <div class="w-[450px] h-[270px] overflow-hidden bg-slate-900 rounded relative">
      <video ref="video" muted autoplay class="w-full h-full object-cover" />
    </div>

    <div class="w-[350px] flex justify-center items-center flex-col">

      <div class="flex">
        <van-button type="primary" round :disabled="isCancel" @click="emit('join')">Tham Gia </van-button>

        <div class="w-5"></div>

        <van-button type="danger" round @click="isCancel = true">Huỷ Bỏ</van-button>
      </div>

      <div class="mt-4 text-white text-xs">
        <span class="text-xs">ID: {{ roomStore.uid }}</span>
        <span class="px-2">|</span>
        <span class="text-xs">Phòng: {{ chanel }}</span>

      </div>

      <div v-if="isCancel" class="mt-4 text-white text-xs">
        Bạn đã lựa chọn không tham gia cuộc họp.
      </div>

     <div v-else class="mt-4">
       <div
           v-for="camera of cameras"
           :key="camera.deviceId"
           class="px-2 py-1 cursor-pointer text-white text-xs"
           :class="{'text-primary': currentCamera === camera.deviceId }"
           @click="currentCamera = camera.deviceId"
       >
         {{ camera.label }}
       </div>
     </div>

    </div>

  </div>

</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref, watchEffect} from 'vue'
import { useDevicesList, useUserMedia } from '@vueuse/core'
import {useRoomStore} from "../stores/room";
import {makeid} from "../utils/random-string";
import {faker} from "@faker-js/faker";
const currentCamera = ref<string>()
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
})
const video = ref<HTMLVideoElement>()
const { stream, enabled } = useUserMedia({
  videoDeviceId: currentCamera,
})
watchEffect(() => {
  if (video.value)
    video.value.srcObject = stream.value!
})

onMounted(() => nextTick(() => enabled.value = true))

const emit = defineEmits<{
  (e: 'join'): void
}>()

const roomStore = useRoomStore()

const isCancel = ref(false)

const loading = ref(false)

const chanel = ref('smileeye')

</script>

<style scoped>

</style>
