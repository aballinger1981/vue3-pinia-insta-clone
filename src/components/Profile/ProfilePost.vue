<template>
  <v-img :src="post.imageUrl" alt="Profile Post" class="profile-post-image" rounded cover aspect-ratio="1" @click="toggleProfilePostDialog">
    <v-icon class="heart-icon" icon="mdi-heart" />
    <span class="ml-2 pt-2 font-weight-bold text-h6">{{ post.likes.length }}</span>
    <v-icon class="chat-icon ml-10" icon="mdi-chat" />
    <span class="ml-2 pt-2 font-weight-bold text-h6">{{ post.comments.length }}</span>
  </v-img>
  <ProfilePostDialog v-if="isProfilePostDialogOpen" v-model:is-open="isProfilePostDialogOpen" :post="post" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Post } from '@/models/post';
import ProfilePostDialog from './ProfilePostDialog.vue';

defineProps<{
  post: Post;
}>();

const isProfilePostDialogOpen = ref<boolean>(false);

const toggleProfilePostDialog = () => {
  isProfilePostDialogOpen.value = !isProfilePostDialogOpen.value;
};
</script>

<style scoped lang="scss">
.profile-post-image {
  :deep(.v-responsive__content) {
    cursor: pointer;
    display: none;
  }
}
.profile-post-image:hover {
  :deep(.v-responsive__content) {
    cursor: pointer;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>