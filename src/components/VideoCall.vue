<template>
  <div>
    <h4>{{ uid }}</h4>
    <div ref="el" class="video-call"></div>

    <div>
      <pre>
        audio: {{ localAudioTrack.getTrackId() }}
        video: {{ localVideoTrack.getTrackId() }}
      </pre>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref, watch} from "vue";
import {ILocalTrack} from "agora-rtc-sdk-ng";

const props = defineProps<{
  uid: string|number
  localAudioTrack?: ILocalTrack
  localVideoTrack?: ILocalTrack
}>()

const el = ref<HTMLDivElement>()

const emit = defineEmits(['logger'])

onMounted(() => nextTick(() => {
  props.localVideoTrack?.play(el.value)
  props.localAudioTrack?.play()
}))

watch(() => props.localVideoTrack, (track) => {
  if (track) {
    track.play(el.value)
  }
})
watch(() => props.localAudioTrack, (track) => {
  if (track) {
    track.play()
  }
})

</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "VideoCall"
})
</script>

<style>
.video-call {
  width: 100%;
  aspect-ratio: 1/1;
}
</style>
