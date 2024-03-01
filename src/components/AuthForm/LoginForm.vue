<template>
  <v-col>
    <v-form @submit.prevent @keyup.enter="handleLogin">
      <v-text-field v-model="email" label="Email" variant="outlined" density="compact" required type="email"></v-text-field>
      <v-text-field v-model="password" label="Password" variant="outlined" density="compact" required type="password"></v-text-field>
      <v-btn @click="handleLogin" color="primary" type="submit" block :loading="isLoading">
        Login
      </v-btn>
    </v-form>
  </v-col>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const { isLoading } = storeToRefs(authStore);
const email = defineModel('email');
const password = defineModel('password');

const handleLogin = (event: Event) => {
  event.preventDefault();
  authStore.login({ email: email.value, password: password.value });
}
</script>

<style scoped lang="scss">
.v-col {
  margin: 1rem;
}
</style>