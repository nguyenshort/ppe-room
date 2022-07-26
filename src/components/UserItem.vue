<template>
  <section
      class="item border-[3px]"
      :class="{
         active: isPinner,
      }"
  >

    <div
        class="item-fill action z-[1] flex items-center justify-center relative opacity-0 hover:opacity-100 action"
    >

      <button v-if="roomStore.users.length" class="text-white relative z-[1] transition duration-300 ease-in-out _has_tranform px-4 py-2" @click="roomStore.togglePinner(item)">

        <div class="flex items-center flex-col">
          <svg class="fill-current" width="25px" height="25px" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 400V32l176 80-176 80"/><path d="M256 336c-87 0-175.3 43.2-191.64 124.74C62.39 470.57 68.57 480 80 480h352c11.44 0 17.62-9.43 15.65-19.26C431.3 379.2 343 336 256 336z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>

          <span class="text-xs mt-1">
            {{ !isPinner ? 'Ghim' : 'Bỏ Ghim' }}
          </span>

        </div>

      </button>

      <div class="absolute bg-slate-900 w-full h-full top-0 left-0 opacity-40 z-0"></div>

    </div>

    <!-- Avatar Người dùng -->
    <div class="item-fill z-0 flex items-center justify-center avatar">

      <div v-if="videoEnable" ref="el" class="absolute w-full h-full top-0 left-0"></div>

      <div v-else class="max-w-[100px] max-h-[100px] overflow-hidden rounded-full w-3/5 h-3/5 border-2 border-white dark:border-slate-800 shadow transition duration-300 ease-in-out _has_tranform">
        <img class="w-full h-full" :src="item.user.avatar" :alt="item.user.name" />
      </div>

    </div>

  </section>
</template>

<script lang="ts" setup>
// Thông tin user để hiển thị trên màn hình
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useRoomStore} from "../stores/room";
import {RoomItem} from "../models/room";

const roomStore = useRoomStore()

const props = withDefaults(defineProps<{
  item: RoomItem
  videoEnable?: boolean,
}>(), {
  videoEnable: true,
})

const isPinner = computed(() => {
  return roomStore.pinner?.user?.id ===  props.item.user.id
})

const el = ref<HTMLDivElement>()

onMounted(() => nextTick(() => {
  if (props.videoEnable) {
    props.item.localVideoTrack?.play(el.value)
    props.item.localAudioTrack?.play()
  }
}))

watch(() => props.item.localVideoTrack, (track) => {
  if(props.videoEnable) {
    console.log("======================change track======================")
    nextTick(() => {
      track?.play(el.value)
    })
  }
})

watch(() => props.item.localAudioTrack, (track) => {
  if(props.videoEnable) {
    nextTick(() => track?.play())
  }
})

</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "UserItem"
})
</script>
