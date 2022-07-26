<template>
  <user-item :item="item" />
</template>

<script lang="ts" setup>
import {RoomItem} from "../models/room";
import UserItem from "./UserItem.vue";
import {nextTick, onMounted, ref} from "vue";

const props = defineProps<{
  item: RoomItem
}>()

const el = ref<HTMLDivElement>()

onMounted(() => nextTick(() => {
  props.item.localVideoTrack?.play(el.value)
  props.item.localAudioTrack?.play()
}))

</script>

<style scoped>

</style>
