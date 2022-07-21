<template>
  <div>
    <h4>{{ uid }}</h4>
    <div ref="el" class="video-call"></div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, ref} from "vue";
import {ILocalTrack} from "agora-rtc-sdk-ng";

const props = defineProps<{
  uid: string|number
  localAudioTrack?: ILocalTrack
  localVideoTrack?: ILocalTrack
  user: string|number
}>()

const el = ref<HTMLDivElement>()

const emit = defineEmits(['logger'])

onMounted(() => nextTick(() => {
  props.localVideoTrack?.play(el.value)

  if (props.localAudioTrack) {
    props.localAudioTrack.play()

    if (props.uid === props.user) {
      // emit('logger', `Mute myself for fix audio bug`)
      // props.localAudioTrack.setEnabled(false)
    }

  }

}))

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
