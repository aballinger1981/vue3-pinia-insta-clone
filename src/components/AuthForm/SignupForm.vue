<template>
  <v-col>
    <v-form @submit.prevent>
      <v-text-field v-model="email" label="Email" variant="outlined" density="compact" required type="email"></v-text-field>
      <v-text-field v-model="username" label="Username" variant="outlined" density="compact" required type="text"></v-text-field>
      <v-text-field v-model="fullName" label="Full Name" variant="outlined" density="compact" required type="text"></v-text-field>
      <v-text-field v-model="password" label="Password" variant="outlined" density="compact" required :type="showPassword ? 'text' : 'password'" :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" @click:append-inner="showPassword = !showPassword"></v-text-field>
      <v-btn @click="handleSignup" color="primary" type="submit" block :loading="isLoading">
        Sign Up
      </v-btn>
    </v-form>
  </v-col>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const fullName = defineModel('fullName');
const username = defineModel('username');
const email = defineModel('email');
const password = defineModel('password');
const { isLoading, signup } = useAuthStore();
const showPassword = ref<boolean>(false);

const handleSignup = () => {
  signup({ email: email.value, password: password.value, fullName: fullName.value, username: username.value });
}
</script>

<style scoped lang="scss">
</style>