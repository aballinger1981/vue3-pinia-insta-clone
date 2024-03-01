<template>
  <v-container>
    <v-divider></v-divider>
    <v-tabs v-model="tab" align-tabs="center" hide-slider>
      <v-tab value="posts">
        <v-icon icon="mdi-grid" class="mr-2"></v-icon>
        Posts
      </v-tab>
      <v-tab value="saved" class="ml-4 mr-4">
        <v-icon icon="mdi-bookmark-outline" class="mr-2"></v-icon>
        Saved
      </v-tab>
      <v-tab value="likes">
        <v-icon icon="mdi-heart-outline" class="mr-2"></v-icon>
        Likes
      </v-tab>
    </v-tabs>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const tab = ref<number>(0);
</script>

<style scoped lang="scss">
:deep(.v-slide-group-item--active) {
  border-top: 2px solid white;
}
</style>