<template>
  <user-item :item="item">
    <div ref="el" class="absolute w-full h-full top-0 left-0 _stream"></div>
  </user-item>
</template>

<script lang="ts" setup>
import {RoomItem} from "../models/room";
import UserItem from "./UserItem.vue";
import {nextTick, onMounted, ref, watch} from "vue"

const props = defineProps<{
  item: RoomItem,
  current?: boolean
}>()

const el = ref<HTMLDivElement>()

onMounted(() => nextTick(() => {
  props.item.localVideoTrack?.play(el.value)
  if(!props.current) {
    props.item.localAudioTrack?.play()
  }
}))

watch(() => props.item.localVideoTrack, (track) => {
  nextTick(() => {
    track?.play(el.value)
  })
})

watch(() => props.item.localAudioTrack, (track) => {
  if(!props.current) {
    nextTick(() => track?.play())
  }
})

</script>

<style scoped>

</style>
