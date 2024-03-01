<template>
  <v-container v-if="isGettingProfilePosts">
    <v-row>
      <v-col :cols="isMediumAndAbove ? '4' : '12'" v-for="i in 3" :key="i" :style="{ 'max-height': isMediumAndAbove ? '315px' : '100%', 'max-width': isMediumAndAbove ? '315px' : '100%' }">
        <v-skeleton-loader type="image">
        </v-skeleton-loader>
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else-if="!isGettingProfilePosts && posts.length > 0">
    <v-row>
      <v-col :cols="isMediumAndAbove ? '4' : '12'" v-for="post in posts" :key="post.id" :style="{ 'max-height': isMediumAndAbove ? '315px' : '100%', 'max-width': isMediumAndAbove ? '315px' : '100%' }" class="d-flex">
        <ProfilePost :post="post" />
      </v-col>
    </v-row>
  </v-container>
  <v-container v-else-if="!isGettingProfilePosts">
    <v-sheet>
      No posts to show
    </v-sheet>
  </v-container>
</template>

<script setup lang="ts">
import { watch, computed, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserProfileStore } from '@/stores/userProfile';
import { usePostStore } from '@/stores/post';
import ProfilePost from '@/components/Profile/ProfilePost.vue';
import { useDisplay } from 'vuetify';

const display = useDisplay();
const userProfileStore = useUserProfileStore();
const postStore = usePostStore();
const { isGettingProfilePosts, profile } = storeToRefs(userProfileStore);
const { posts } = storeToRefs(postStore);

onUnmounted(() => {
  postStore.resetPosts();
  userProfileStore.resetProfile();
});

const isMediumAndAbove = computed(() => {
  return display.mdAndUp.value;
});

watch(() => profile?.value, async () => {
  await userProfileStore.getProfilePosts();
}, { immediate: true });
</script>

<style scoped lang="scss"></style>