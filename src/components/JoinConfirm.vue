<template>

  <div class="overflow-hidden px-5 flex items-center">

    <div class="overflow-hidden bg-slate-900 rounded relative">


      <div ref="stream" class="object-cover w-[450px] h-[270px] z-10 relative" />

      <div v-if="!mediaStatus.cam" class="z-20 absolute text-white top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">Bạn đã tắt Camera</div>

      <div class="z-20 absolute bottom-0 left-0 right-0 px-4 py-3 flex items-center justify-center">

        <user-media-controls />

      </div>

    </div>

    <div class="w-[350px] flex justify-center items-center flex-col">

      <div class="flex">
        <van-button type="primary" round :disabled="isCancel" @click="onJoin">Tham Gia </van-button>

        <div class="w-5"></div>

        <van-button type="danger" round @click="isCancel = true">Huỷ Bỏ</van-button>
      </div>

      <div class="mt-4 text-white text-xs">
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
import {nextTick, onMounted, reactive, ref, watchEffect} from 'vue'
import { useDevicesList, useUserMedia } from '@vueuse/core'
import {useRoomStore} from "../stores/room";
import {useRTC} from "../compositions/useRTC";
import agora from "agora-rtc-sdk-ng";
import UserMediaControls from "./UserMediaControls.vue";
const currentCamera = ref<string>()
const { videoInputs: cameras } = useDevicesList({
  requestPermissions: true,
  onUpdated() {
    if (!cameras.value.find(i => i.deviceId === currentCamera.value))
      currentCamera.value = cameras.value[0]?.deviceId
  },
})

const emit = defineEmits<{
  (e: 'join'): void
}>()

const roomStore = useRoomStore()

const isCancel = ref(false)

const loading = ref(false)

const chanel = ref('smileeye')

const rtc = useRTC()

const onJoin = async () => {

  loading.value = true

  roomStore.setUser({
    id: Math.round(Math.random() * 1000000 ),
    name: 'smileeye',
    avatar: 'https://i.pravatar.cc/300',
  })

  await rtc.client.join("6bc0bf7f3e364153ba533fd765fb9c60", chanel.value, null, roomStore.user?.id)

  const _traks = []

  if(rtc.localAudioTrack) {
    _traks.push(rtc.localAudioTrack)
  }
  if(rtc.localVideoTrack) {
    _traks.push(rtc.localVideoTrack)
  }

  await rtc.client.publish(_traks)

  loading.value = false
  emit('join')
}

const mediaStatus = reactive({
  mic: true,
  cam: true,
})

const showControl = ref(false)

const initVolumeAndAudio = async () => {
  // Create a local video track from the video captured by a camera.
  rtc.localVideoTrack = await agora.createCameraVideoTrack()


  rtc.localAudioTrack = await agora.createMicrophoneAudioTrack();

  showControl.value = true
}

const toggleMic = async () => {
  mediaStatus.mic = !mediaStatus.mic
  await rtc.localAudioTrack?.setMuted(!mediaStatus.mic)
}

const toggleCam = async () => {
  mediaStatus.cam = !mediaStatus.cam
  await rtc.localVideoTrack?.setMuted(!mediaStatus.cam)
}

const stream = ref<HTMLDivElement>()
const initPreview = () => {
  try {
    rtc.localVideoTrack?.play(stream.value)
  } catch (e) {
      // ko có quyền/cam....
  }
}

onMounted(async () => {
  await initVolumeAndAudio()
  await initPreview()
})

</script>

<style scoped>

</style>
