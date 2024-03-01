<template>
  <v-list-item class="mb-2">
    <template v-slot:prepend>
      <v-avatar size="small">
        <v-img v-if="profile?.profilePictureURL" :src="profile?.profilePictureURL" />
        <v-icon v-else icon="mdi-account-circle" size="50px" />
      </v-avatar>
    </template>
    <template v-slot:default>
      <v-list-item-subtitle>
        <span class="font-weight-black">{{ profile?.username }}</span>
        <span class="pl-2">{{ comment.comment }}</span>
      </v-list-item-subtitle>
      <v-list-item-subtitle class="pt-1 font-weight-light">{{ timeAgo(comment.createdAt) }}</v-list-item-subtitle>
    </template>
  </v-list-item>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import type { Comment } from '@/models/comment';
import type { User } from '@/models/user';
import { useUserProfileStore } from '@/stores/userProfile';
import { timeAgo } from '@/utils/timeAgo';

const props = defineProps<{
  comment: Comment;
}>();
const emits = defineEmits(['commented']);

const { getUserProfileById } = useUserProfileStore();
const profile = ref<User | null>(null);

watch(() => props.comment, async () => {
  const { profileById } = await (getUserProfileById(props.comment.createdBy) as Promise<{ profileById: User }>);
  if (!profileById) return;
  profile.value = profileById;
  emits('commented');
}, { immediate: true });
</script>

<style scoped lang="scss"></style>