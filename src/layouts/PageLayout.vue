<template>
  <v-layout>
    <SidebarComponent class="sidebar" v-if="canRenderSidebar" />
    <AppBarComponent v-if="canRenderNavbar" />
    <v-main class="d-flex align-center">
      <RouterView />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterView } from 'vue-router';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import SidebarComponent from '@/components/Sidebar/SidebarComponent.vue';
import AppBarComponent from '@/components/AppBar/AppBarComponent.vue';

const authStore = useAuthStore();
const route = useRoute();

const canRenderSidebar = computed(() => route.path !== '/auth' && !!authStore.userInfo);
const canRenderNavbar = computed(() => !authStore.userInfo && route.path !== '/auth');

</script>
<style scoped lang="scss">
.v-layout {
  height: 100vh;
  .v-main {
    height: 100vh;
    overflow-y: auto;
  }
}
</style>