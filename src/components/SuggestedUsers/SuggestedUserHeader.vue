<template>
  <v-list-item class="pb-4">
    <template v-slot:prepend>
      <v-avatar v-if="authStore?.userInfo?.profilePictureURL" height="40" width="40">
        <v-img :src="authStore?.userInfo?.profilePictureURL" :alt="authStore?.userInfo?.fullName" />
      </v-avatar>
      <v-avatar v-else size="sm" height="40" width="40">
        <v-icon icon="mdi-account-circle" size="40" />
      </v-avatar>
    </template>
    <v-list-item-title class="d-flex align-center">
      <v-list-item-subtitle>{{ authStore?.userInfo?.username }}</v-list-item-subtitle>
      <v-spacer></v-spacer>
      <v-btn class="text-none" variant="text" color="primary" @click="authStore?.logout">
        Log out
      </v-btn>
    </v-list-item-title>
  </v-list-item>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
</script>

<style scoped lang="scss"></style>