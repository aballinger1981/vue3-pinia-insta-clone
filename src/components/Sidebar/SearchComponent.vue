<template>
  <v-list-item class="mt-3" link title="Search" prepend-icon="mdi-magnify">
    <v-dialog v-model="dialog" activator="parent" location-strategy="connected" transition="slide-x-transition"
      max-width="400px">
      <v-card class="pt-2 pb-2">
        <v-card-title class="d-flex">
          Search User
          <v-spacer></v-spacer>
          <v-btn class="close-button" variant="text" icon="mdi-close" @click="dialog = false"></v-btn>
        </v-card-title>
        <v-card-text>
          <v-label class="pb-2">Username</v-label>
          <v-form @submit.prevent @keyup.enter="handleSearchUser">
            <v-text-field ref="searchTextFieldRef" v-model="searchTerm" label="Search" variant="outlined" density="compact"></v-text-field>
            <v-card-actions class="pa-0">
              <v-spacer></v-spacer>
              <v-btn variant="elevated" color="primary" @click="handleSearchUser" :loading="searchUserStore.isLoading"
                :disabled="!searchTerm" type="submit">Search</v-btn>
            </v-card-actions>
          </v-form>
        </v-card-text>
        <v-list v-if="searchUserStore.searchUser">
          <v-list-item class="user-list">
            <template v-slot:prepend>
              <v-icon class="cursor-pointer" v-if="!searchUserStore.searchUser?.profilePictureURL"
                icon="mdi-account-circle" size="x-large"></v-icon>
              <v-avatar v-else size="large" class="cursor-pointer">
                <v-img :src="searchUserStore.searchUser?.profilePictureURL" />
              </v-avatar>
            </template>
            <template v-slot:title>
              <span class="text-subtitle-2 cursor-pointer">{{ searchUserStore.searchUser?.fullName }}</span>
              <span class="font-weight-thin text-caption">{{ numberOfFollowers }} {{ `${numberOfFollowers > 1 ||
                numberOfFollowers === 0 ? 'followers' : 'follower'}` }}</span>
            </template>
            <template v-slot:append>
              <v-btn class="text-none" variant="text" size="small" color="secondary" :loading="isUpdatingFollowingUser"
                @click="onFollowUser">
                {{ `${isFollowing ? 'Unfollow' : 'Follow'}` }}
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-list-item>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useSearchUserStore } from '@/stores/userSearch';
import { useAuthStore } from '@/stores/auth';
import { useFollowUserStore } from '@/stores/followUser';
import { storeToRefs } from 'pinia';

const dialog = ref<boolean>(false);
const searchTerm = ref<string>('');
const searchUserStore = useSearchUserStore();
const followUserStore = useFollowUserStore();
const { handleFollowUser } = useFollowUserStore();
const { isUpdatingFollowingUser } = storeToRefs(followUserStore);
const authStore = useAuthStore();
const searchTextFieldRef = ref<HTMLInputElement>();

const isFollowing = computed(() => {
  return searchUserStore.searchUser ? authStore.userInfo.following.includes(searchUserStore.searchUser.uid) : null;
});

const numberOfFollowers = computed(() => {
  return searchUserStore.searchUser ? searchUserStore.searchUser.followers.length : 0;
});

const handleSearchUser = (event: Event) => {
  event.preventDefault();
  searchUserStore.search(searchTerm.value);
};

const onFollowUser = async () => {
  if (!searchUserStore.searchUser) return;
  await handleFollowUser(searchUserStore.searchUser.uid);
  if (isFollowing.value) {
    searchUserStore.setSearchUser({
      ...searchUserStore.searchUser,
      followers: searchUserStore.searchUser ? searchUserStore.searchUser.followers.filter((uid) => uid !== authStore.userInfo.uid) : [],
    });
  } else {
    searchUserStore.setSearchUser({
      ...searchUserStore.searchUser,
      followers: searchUserStore.searchUser ? [...searchUserStore.searchUser.followers, authStore.userInfo.uid] : [],
    });
  }
};

watch(() => [searchTextFieldRef.value], (searchTextField) => {
  if (searchTextField && searchTextFieldRef.value && dialog.value) {
    searchTextFieldRef.value.focus();
  }
});

</script>

<style scoped lang="scss">
.v-dialog {
  .close-button {
    position: absolute;
    top: 0;
    right: 0;
  }

  .user-list {
    :deep(.v-list-item__spacer) {
      width: .5rem;
    }

    :deep(.v-list-item-title) {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>