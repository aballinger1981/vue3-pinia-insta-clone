<template>
  <v-container class="d-flex flex-column h-100" :class="{ 'pa-12': isMediumAndAbove }">
    <v-sheet v-if="!isGettingUserProfileByName && !profile">
      <v-list>
        <v-list-item>
          <template v-slot:title>
            User Not Found
          </template>
          <template v-slot:default>
            <v-btn class="text-none mt-2" to="/" variant="text">
              Go Home
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-sheet>
    <template v-if="profile">
      <ProfileHeader />
      <ProfileTabs />
      <ProfilePosts />
    </template>
  </v-container>
</template>

<script setup lang="ts">
import { watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import ProfileHeader from '@/components/Profile/ProfileHeader.vue';
import ProfileTabs from '@/components/Profile/ProfileTabs.vue';
import ProfilePosts from '@/components/Profile/ProfilePosts.vue';
import { useUserProfileStore } from '@/stores/userProfile';
import { useDisplay } from 'vuetify';
import { onMounted } from 'vue';

const display = useDisplay();
const route = useRoute();
const userProfileStore = useUserProfileStore();
const { profile, isGettingUserProfileByName } = storeToRefs(userProfileStore);

onMounted(() => {
  userProfileStore.getUserProfileByUsername(route.params.username as string);
});

const isMediumAndAbove = computed(() => {
  return display.mdAndUp.value;
});

watch(() => route?.params, async () => {
  if (!route.params.username) return;
  userProfileStore.getUserProfileByUsername(route.params.username as string);
  await userProfileStore.getProfilePosts();
});
</script>

<style scoped lang="scss"></style>