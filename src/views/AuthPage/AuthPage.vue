<template>
  <v-container :style="{ width: isXs ? '80%' : '40rem' }">
    <v-row justify="center">
      <v-col v-if="isMediumAndAbove">
        <v-img class="auth-image" src="/auth.png" />
      </v-col>
      <v-col class="auth-form-column" sm="6">
        <AuthForm />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDisplay } from 'vuetify';
import AuthForm from '@/components/AuthForm/AuthForm.vue'

const display = useDisplay();

const isMediumAndAbove = computed(() => {
  return display.mdAndUp.value;
});
const isXs = computed(() => {
  return display.xs.value;
});
</script>

<style scoped lang="scss">
.v-container {
  height: 650px;
  min-width: 15rem;

}
</style>