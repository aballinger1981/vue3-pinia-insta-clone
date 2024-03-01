<template>
  <v-list-item>
    <template v-slot:prepend>
      <v-avatar v-if="props.user.profilePictureURL" height="40" width="40">
        <v-img :src="props.user.profilePictureURL" :alt="user.fullName" />
      </v-avatar>
      <v-avatar v-else size="sm" height="40" width="40">
        <v-icon icon="mdi-account-circle" size="40" />
      </v-avatar>
    </template>
    <template v-slot:default>
      <v-list-item-subtitle>{{ props.user.fullName }}</v-list-item-subtitle>
      <v-list-item-subtitle class="text-caption">{{ props.user.followers.length }} {{ `${props.user.followers.length === 0
        ||
        props.user.followers.length > 1 ? 'followers' : 'follower'}` }}</v-list-item-subtitle>
    </template>
    <template v-slot:append>
      <v-btn class="text-none" variant="text" color="secondary" @click="$emit('handleFollowUser', props.user.uid)">
        Follow
      </v-btn>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import type { User } from '@/models/user';

const props = defineProps<{
  user: User;
}>();

defineEmits(['handleFollowUser']);

</script>

<style scoped lang="scss"></style>