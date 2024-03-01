<template>
  <v-sheet v-if="profile" class="pa-6 profile-header">
    <v-row>
      <v-col class="avatar-column pr-12">
        <v-avatar v-if="!profile.profilePictureURL" size="100">
          <v-icon icon="mdi-account-circle" size="100" />
        </v-avatar>
        <v-avatar v-else size="150">
          <v-img :src="profile.profilePictureURL" :alt="profile.fullName" />
        </v-avatar>
      </v-col>
      <v-col class="d-flex flex-column justify-center pt-6 pb-6" :style="{ 'min-width': '250px' }">
        <v-row>
          <span class="text-h6">{{ profile?.username }}</span>
          <v-btn v-if="visitingOwnProfileAndAuth" class="ml-4 mb-2 text-none" color="primary" size="default" @click="toggleEditProfile">
            Edit Profile
          </v-btn>
          <v-btn v-else-if="visitingAnotherProfileAndAuth" class="ml-4 mb-2 text-none" size="default" :loading="isUpdatingFollowingUser" @click="handleFollowUser(profile.uid)" color="primary">
            {{ isFollowing(profile.uid) ? 'Unfollow' : 'Follow' }}
            </v-btn>
            <EditProfile v-if="isEditProfileDialogOpen" v-model:is-open="isEditProfileDialogOpen" />
        </v-row>
        <v-row class="text-body-2">
          <span class="font-weight-bold">{{ profile.posts.length }}</span>
          <span class="ml-2">Posts</span>
          <span class="ml-4 font-weight-bold">{{ profile.followers.length }}</span>
          <span class="ml-2">{{ `${profile?.followers.length === 1 ? 'Follower' : 'Followers'}` }}</span>
          <span class="ml-4 font-weight-bold">{{ profile.following.length }}</span>
          <span class="ml-2">Following</span>
        </v-row>
        <v-row>
          <span class="text-subtitle-1 font-weight-bold">{{ profile.fullName }}</span>
        </v-row>
        <v-row class="text-subtitle-2">
          <span v-if="profile.bio">{{ profile.bio }}</span>
          <span v-else>This user has no bio yet</span>
        </v-row>
      </v-col>
    </v-row>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useUserProfileStore } from '@/stores/userProfile';
import { storeToRefs } from 'pinia';
import EditProfile from '@/components/Profile/EditProfile.vue';
import { useFollowUserStore } from '@/stores/followUser';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const followUserStore = useFollowUserStore();
const profileStore = useUserProfileStore();
const { isFollowing, handleFollowUser } = useFollowUserStore();
const { isUpdatingFollowingUser } = storeToRefs(followUserStore);
const { profile } = storeToRefs(profileStore);
const isEditProfileDialogOpen = ref<boolean>(false);

const visitingOwnProfileAndAuth = computed(() => {
  return authStore && authStore.userInfo?.username === profile?.value?.username;
});
const visitingAnotherProfileAndAuth = computed(() => {
  return authStore && authStore.userInfo?.username !== profile?.value?.username;
});

const toggleEditProfile = () => {
  isEditProfileDialogOpen.value = !isEditProfileDialogOpen.value;
};

</script>

<style scoped lang="scss">
.profile-header {
  .avatar-column {
    flex-grow: 0;
  }
}
</style>