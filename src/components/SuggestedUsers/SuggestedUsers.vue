<template>
  <v-list>
    <SuggestedUserHeader />
    <v-list-item>
      <template v-slot:subtitle>
        Suggested for you
      </template>
      <template v-slot:append>
        <v-btn class="text-none" variant="text">
          See All
        </v-btn>
      </template>
    </v-list-item>
    <template v-for="user in suggestedUsers" :key="user.id">
      <SuggestedUser :user="user" @handle-follow-user="handleFollowUser" />
    </template>
    <v-list-item class="text-caption">
      © 2024 Built By
      <a class="github-link text-caption" variant="text" color="secondary" href="https://github.com/aballinger1981" target="_blank">
          Andrew
      </a>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { useGetSuggestedUsers } from '@/composables/useGetSuggestedUsers';
import { useFollowUserStore } from '@/stores/followUser';
import SuggestedUser from './SuggestedUser.vue';
import SuggestedUserHeader from './SuggestedUserHeader.vue';

const followUserStore = useFollowUserStore();
const { suggestedUsers } = useGetSuggestedUsers();

const handleFollowUser = (uid: string) => {
  followUserStore.handleFollowUser(uid);
};

</script>

<style scoped lang="scss">
.suggested-users-profile-icon {
  font-size: 5rem;
}
.see-all {
  color: white;
  cursor: pointer;
}
.github-link {
  color: white;
  cursor: pointer;
  text-decoration: none;
}
</style>