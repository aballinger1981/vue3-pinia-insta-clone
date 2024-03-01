<template>
  <v-sheet v-if="profile" class="feed-post">
    <v-list-item-title class="d-flex align-center pb-2">
      <RouterLink :to="`/${profile.username}`">
      <v-avatar v-if="profile.profilePictureURL" size="40">
        <v-img :src="profile.profilePictureURL" :alt="profile.fullName" />
      </v-avatar>
      <v-avatar v-else size="sm">
        <v-icon icon="mdi-account-circle" size="40" />
      </v-avatar>
    </RouterLink>
      <v-list-item-subtitle class="pl-2">{{ profile.username }}</v-list-item-subtitle>
      <v-list-item-subtitle class="pl-2">&bull; {{ timeAgo(post.createdAt) }}</v-list-item-subtitle>
      <v-spacer></v-spacer>
      <v-btn class="text-none" variant="text" size="small" color="secondary" :loading="isUpdatingFollowingUser"
        @click="followUser">
        {{ `${authUserIsFollowing ? 'Unfollow' : 'Follow'}` }}
      </v-btn>
    </v-list-item-title>
    <v-img class="feed-post-image" :src="post.imageUrl" height="auto" cover />
    <PostFooter v-if="profile" :post="post" :profile="profile" />
  </v-sheet>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';
import type { Post } from '@/models/post';
import PostFooter from './PostFooter.vue';
import { useAuthStore } from '@/stores/auth';
import { useUserProfileStore } from '@/stores/userProfile';
import { useFollowUserStore } from '@/stores/followUser';
import { timeAgo } from '@/utils/timeAgo';
import type { User } from '@/models/user';

const props = defineProps<{
  post: Post;
}>();

const authStore = useAuthStore();
const userProfileStore = useUserProfileStore();
const followUserStore = useFollowUserStore();
const { handleFollowUser } = useFollowUserStore();
const { isUpdatingFollowingUser } = storeToRefs(followUserStore);
const profile = ref<User | null>(null);

onMounted(async () => {
  const { profileById } = await (userProfileStore.getUserProfileById(props.post.createdBy) as Promise<{ profileById: User }>);
  if (!profileById) return;
  profile.value = profileById;
});

const authUserIsFollowing = computed(() => {
  if (!profile.value) return;
  return authStore.userInfo.following.includes(profile.value.uid);
});

const followUser = async () => {
  if (!profile.value) return;
  await handleFollowUser(profile.value.uid);
};
</script>

<style scoped lang="scss">
.feed-post {
  cursor: pointer;

  .feed-post-image {
    border-radius: 4px;
  }
}
</style>