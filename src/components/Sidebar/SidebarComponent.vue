<template>
  <v-navigation-drawer class="d-flex flex-column justify-space-between" location="left" permanent :rail="isSmallAndBelow">
    <v-list class="d-flex flex-column mt-2" height="calc(100% - (4rem + 32px))">
      <v-list-item class="logo d-flex align-center" height="4rem" link to="/">
        <SvgImage v-if="isSmallAndBelow" name="instagramMobileLogo" />
        <SvgImage v-if="isMediumAndAbove" name="instagramLogo" />
      </v-list-item>
      <v-list-item :active="isHomePath" class="mt-5" link title="Home" prepend-icon="mdi-home" to="/"></v-list-item>
      <SearchComponent />
      <v-list-item class="mt-3" link title="Notification" prepend-icon="mdi-heart-outline"></v-list-item>
      <CreatePost />
      <v-list-item class="mt-3" link title="Profile" :prepend-avatar="authStore?.userInfo?.profilePictureURL"
        :prepend-icon="authStore?.userInfo?.profilePictureURL ? '' : 'mdi-account-circle'"
        :to="{ path: `/${authStore?.userInfo?.username}`, force: true }"></v-list-item>
    </v-list>
    <v-list>
      <v-list-item class="mb-6" link title="Logout" prepend-icon="mdi-logout" @click="handleLogout"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';
import SvgImage from '@/assets/SvgImage.vue';
import SearchComponent from './SearchComponent.vue';
import CreatePost from './CreatePost.vue';

const display = useDisplay();
const route = useRoute();
const authStore = useAuthStore();
const { logout } = useAuthStore();

const isSmallAndBelow = computed(() => {
  return display.smAndDown.value;
});
const isMediumAndAbove = computed(() => {
  return display.mdAndUp.value;
});
const isHomePath = computed(() => {
  return route.path === '/';
});

const handleLogout = () => {
  logout();
}

</script>

<style scoped lang="scss">
.logo {
  :deep(.v-list-item__overlay) {
    background-color: transparent;
  }
}
</style>