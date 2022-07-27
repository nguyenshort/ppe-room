<template>

  <div v-if="roomStore.hasPinner" class="absolute w-[140px] audience-list">

    <user-item
        class="mt-2 first:mt-0"
        :item="roomStore.rtc"
        :videoEnable="false"
    ></user-item>

    <user-item
        v-for="item in roomStore.users"
        :key="item.user.id"
        class="mt-2 first:mt-0"
        :item="item"
        :videoEnable="false"
    ></user-item>
  </div>

</template>

<script lang="ts" setup>
import {useRoomStore} from "../stores/room";
import UserItem from "./UserItem.vue";

const roomStore = useRoomStore()

</script>

<style scoped>

.audience-list {
  @apply right-0 h-full top-0 z-20 overflow-y-auto scrollbar-hide
}

.audience-list {
  background: rgba(30, 41, 58, 0.24);
  padding-left: 10px;
  padding-right: 10px;
}

.audience-list .item {
  aspect-ratio: 1;
}

</style>
