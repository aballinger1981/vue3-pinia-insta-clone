<template>
  <template v-if="isGettingPosts">
    <v-skeleton-loader
      v-for="i in 5" :key="i"
      type="list-item-avatar, image"
      >
    </v-skeleton-loader>
  </template>
  <v-list v-if="!isGettingPosts && posts.length > 0">
    <v-list-item v-for="post in posts" :key="post.id">
      <FeedPost :post="post" />
    </v-list-item>
  </v-list>
  <v-sheet v-if="!isGettingPosts && posts.length === 0">
    No posts to show
  </v-sheet>
</template>

<script setup lang="ts">
import { watch, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { usePostStore } from '@/stores/post';
import { useAuthStore } from '@/stores/auth';
import FeedPost from '@/components/FeedPosts/FeedPost.vue';

const postStore = usePostStore();
const authStore = useAuthStore();
const { isGettingPosts, posts } = storeToRefs(postStore);

onUnmounted(() => {
  postStore.resetPosts();
});

watch(() => [authStore?.userInfo?.following], () => {
  postStore.getPosts();
}, { immediate: true });
</script>

<style scoped lang="scss"></style>