<template>
  <div class="z-30 absolute top-3 left-3 bg-slate-800 text-xs px-4 py-2 text-white rounded flex items-center">
    <div class="w-[25px] h-[25px] overflow-hidden rounded-full">
      <img class="w-full h-full object-cover" :src="roomStore.pinner?.user?.avatar"  alt=""/>
    </div>
    <span class="ml-2">
      {{ roomStore.pinner.user?.name }} đang trình bày
    </span>
  </div>
</template>

<script lang="ts" setup>
import {useRoomStore} from "../stores/room";

const roomStore = useRoomStore()

</script>

<style scoped>

</style>
