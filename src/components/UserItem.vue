<template>
  <section
      class="item border-[3px]"
      :class="{
         active: roomStore.talker?.id === item?.user?.id,
         _talking: isTalking,
      }"
  >

    <div
        class="item-fill action z-[1] flex items-center justify-center relative opacity-0 hover:opacity-100 action"
    >

      <button class="text-white relative z-[1] transition duration-300 ease-in-out _has_tranform px-4 py-2" @click="togglePinner">

        <div class="flex items-center flex-col">
          <svg class="fill-current" width="25px" height="25px" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M256 400V32l176 80-176 80"/><path d="M256 336c-87 0-175.3 43.2-191.64 124.74C62.39 470.57 68.57 480 80 480h352c11.44 0 17.62-9.43 15.65-19.26C431.3 379.2 343 336 256 336z" fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="32"/></svg>
        </div>

      </button>

      <div class="absolute bg-slate-900 w-full h-full top-0 left-0 opacity-40 z-0"></div>

    </div>

    <!-- Avatar Người dùng -->
    <div class="item-fill z-0 flex items-center justify-center avatar">

      <auto-avatar class="max-w-[100px] max-h-[100px] _avatar" :name="item.user.name" :avatar="item.user.avatar"></auto-avatar>
      <slot></slot>

    </div>

  </section>
</template>

<script lang="ts" setup>
// Thông tin user để hiển thị trên màn hình
import {computed} from "vue";
import {useRoomStore} from "../stores/room";
import {RoomItem} from "../models/room";
import AutoAvatar from "./AutoAvatar.vue";

const roomStore = useRoomStore()

const props = withDefaults(defineProps<{
  item: RoomItem
}>(), {})

const togglePinner = () => {
  if (props.item.user?.id === roomStore.pinner?.id) {
    roomStore.setPinner(undefined)
  } else {
    roomStore.setPinner(props.item.user)
  }
}

const isTalking = computed(() => {
  return roomStore.talkers.findIndex((e) => e.uid === props.item.user.id) > -1
})

</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "UserItem"
})
</script>
