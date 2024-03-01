<template>
  <v-app-bar height="80">
    <v-img class="logo" src="/logo.png" height="100%" width="auto"
      :style="{ display: isSmallAndAbove ? 'block' : 'none' }"></v-img>
    <v-container :style="{ display: 'flex', justifyContent: isSmallAndAbove ? 'flex-end' : 'center' }">
      <RouterLink to="/auth">
        <v-btn class="login-button cursor-pointer" background="primary" color="white">Login</v-btn>
      </RouterLink>
      <RouterLink to="/auth">
        <v-btn variant="outlined">Sign Up</v-btn>
      </RouterLink>
    </v-container>
  </v-app-bar>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

const display = useDisplay();

const isSmallAndAbove = computed(() => {
  return display.smAndUp.value;
});
</script>

<style scoped lang="scss">
.v-toolbar {
  box-shadow: none !important;
  padding: 0 2rem 0 2rem !important;

  .login-button {
    margin-right: 1rem;
    background-color: rgb(var(--v-theme-primary));
  }
}
</style>