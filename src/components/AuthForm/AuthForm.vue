<template>
  <v-sheet class="auth-form-container">
    <v-row>
      <v-img src="/logo.png" />
    </v-row>
    <v-row>
      <LoginForm v-if="isLogin" />
      <SignupForm v-else />
    </v-row>
    <v-row class="divider">
      <v-col>
        <v-divider />
      </v-col>
      <v-col cols="1" :style="{ padding: '0', textAlign: 'center' }">
        Or
      </v-col>
      <v-col>
        <v-divider />
      </v-col>
    </v-row>
    <GoogleAuth :prefix="isLogin ? 'Login' : 'Sign up'" />
  </v-sheet>
  <v-row class="login-signup-row">
    <v-col class="login-signup-column">
      <span> {{ isLogin ? "Don't have an account?" : "Already have an account?" }}</span>
      <span class="action-text" @click="setIsLogin">{{ isLogin ? "Sign Up" : "Login" }}</span>
    </v-col>
  </v-row>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import LoginForm from '@/components/AuthForm/LoginForm.vue'
import GoogleAuth from '@/components/AuthForm/GoogleAuth.vue'
import SignupForm from '@/components/AuthForm/SignupForm.vue'

const isLogin = ref<boolean>(true);

const setIsLogin = () => {
  isLogin.value = !isLogin.value;
}

</script>
<style scoped lang="scss">
.auth-form-container {
  border: 1px solid gray;
  border-radius: 4px;
  padding: 1rem;
  .divider {
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
}
.login-signup-row {
    border: 1px solid gray;
    border-radius: 4px;
    margin: 1rem 0 0 0;
    padding: 1.5rem 1rem 1.5rem 1rem;
    .login-signup-column {
      display: flex;
      justify-content: center;
      margin: 0;
      padding: 0;
      .action-text {
        color: lightblue;
        margin-left: 0.5rem;
        cursor: pointer;
      }
    }
  }
</style>