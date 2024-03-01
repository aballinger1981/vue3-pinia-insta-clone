<template>
  <v-container class="h-100 ma-0" :class="{ 'w-50': isMediumAndAbove, 'w-100': !isMediumAndAbove, 'pa-4': isSmallAndBelow, 'pa-12': isMediumAndAbove }" :style="{ 'max-width': '960px' }">
    <FeedPosts />
  </v-container>
  <v-container class="h-100 pt-6 ma-0" :style="{ 'width': '320px' }" v-if="isMediumAndAbove">
    <SuggestedUsers />
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import FeedPosts from '@/components/FeedPosts/FeedPosts.vue';
import SuggestedUsers from '@/components/SuggestedUsers/SuggestedUsers.vue';

const display = useDisplay();

const isMediumAndAbove = computed(() => {
  return display.mdAndUp.value;
});
const isSmallAndBelow = computed(() => {
  return display.smAndDown.value;
});
</script>

<style scoped lang="scss"></style>
