<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useTheme } from 'vuetify';
import PageLayout from '@/layouts/PageLayout.vue';

const theme = useTheme();
</script>

<template>
  <v-app id="app">
    <RouterView />
  </v-app>
</template>

<style scoped lang="scss"></style>
