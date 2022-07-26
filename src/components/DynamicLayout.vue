<template>
  <div ref="el" class="dynamic-layout max-h-screen h-full relative overflow-hidden max-w-screen w-full">

    <!-- List các user -->

    <template v-if="roomStore.hasPinner">
      <audience-list />
      <presenter-badge />
    </template>

    <div
        class="grid dynamic-grid max-h-screen overflow-y-auto scrollbar-hide relative z-10"
        :class="{
          _on_pinner: roomStore.hasPinner,
        }"
    >

      <!-- Current User-->
      <user-item v-if="roomStore.onCalling" :item="roomStore.rtc" />

      <user-item
          v-for="item in roomStore.users"
          :key="item.user.id"
          :item="item"
      ></user-item>

    </div>
  </div>
</template>

<script lang="ts" setup>
import UserItem from "./UserItem.vue"
import {useRoomStore} from "../stores/room"
import AudienceList from "./AudienceList.vue"
import PresenterBadge from "./PresenterBadge.vue"


const roomStore = useRoomStore()

</script>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "DynamicLayout"
})
</script>

<style>

.dynamic-layout {
}

.dynamic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  grid-gap: 15px;
}

.item-fill {
  @apply absolute top-0 left-0 w-full h-full
}
.animation {
  @apply transition duration-300 ease-in-out
}

.item {
  @apply relative overflow-hidden rounded-md aspect-1 dark:border-slate-900 dark:bg-slate-900 cursor-pointer
}

.item.active {
  grid-column: 1/-1;
}

.dynamic-grid._on_pinner {
/*  position: absolute;
  width: 120px;
  right: 0;*/
}

.dynamic-grid._on_pinner .item.active {
  order: 0;
  display: block;
  width: 100%;
  height: 100%;
  max-height: calc(100vh - 1.25rem - 1.25rem);
}

.dynamic-grid._on_pinner .item {
  order: 1;
  display: none;
}
/*Fix size*/

.dynamic-grid._on_pinner .item.active ._has_tranform {
  transform: translateX(-70px);
}

</style>
