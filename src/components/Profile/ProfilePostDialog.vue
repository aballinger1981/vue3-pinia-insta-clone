<template>
  <v-dialog :model-value="isOpen" :max-height="isMediumAndAbove ? '1000' : '500'">
    <v-sheet class="ma-0">
      <v-btn @click="closeDialog" class="close-button" icon="mdi-close" variant="text">
      </v-btn>
      <v-row v-if="profile" :class="{'pr-12': isMediumAndAbove }" no-gutters>
        <v-col :cols="isMediumAndAbove ? '6' : '12'">
          <v-img :src="post.imageUrl" cover width="100%" height="100%" />
        </v-col>
        <v-col class="pl-4" :cols="isMediumAndAbove ? '6' : '12'" :class="{'pr-4': isSmallAndBelow}">
          <v-alert closable title="Delete Post" v-model="showDeleteConfirmation" type="error" class="mt-4"
            :position="isMediumAndAbove ? 'absolute' : 'relative'" variant="elevated">
            <template v-slot:text>
              <p class="pb-4">Are you sure you want to delete this post?</p>
            </template>
            <template v-slot:default>
              <v-sheet class="d-flex justify-end" :style="{ 'background-color': 'rgb(var(--v-theme-error))' }">
              <v-btn class="mr-4" variant="elevated" @click="showDeleteConfirmation = false">Cancel</v-btn>
              <v-btn variant="outlined" @click="handleDeletePost">Delete</v-btn>
            </v-sheet>
            </template>
          </v-alert>
          <v-list>
            <v-list-item>
              <template v-slot:prepend>
                <v-avatar v-if="profile.profilePictureURL" size="40">
                  <v-img :src="profile.profilePictureURL" :alt="profile.fullName" />
                </v-avatar>
                <v-avatar v-else size="sm">
                  <v-icon icon="mdi-account-circle" size="40" />
                </v-avatar>
              </template>
              <template v-slot:title>
                <span class="text-subtitle-1">{{ profile.username }}</span>
              </template>
              <template v-slot:append>
                <v-btn v-if="visitingOwnProfileAndAuth" icon="mdi-trash-can" @click="confirmDelete"></v-btn>
              </template>
            </v-list-item>
          </v-list>
          <v-divider class="mb-4"></v-divider>
          <v-list ref="commentListRef" :style="{ 'height': '450px', 'overflow-y': 'auto' }">
            <template v-for="(comment, index) in post.comments" :key="index">
              <CommentComponent :comment="comment" @commented="scrollToBottom" />
            </template>
          </v-list>
          <v-divider class="mt-4 mb-4"></v-divider>
          <v-sheet>
            <PostFooter :post="post" :profile="profile" :class="{'ml-4': isMediumAndAbove}" />
          </v-sheet>
        </v-col>
      </v-row>
    </v-sheet>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDisplay } from 'vuetify';
import { useAuthStore } from '@/stores/auth';
import { useUserProfileStore } from '@/stores/userProfile';
import type { Post } from '@/models/post';
import CommentComponent from '../Comments/CommentComponent.vue';
import PostFooter from '../FeedPosts/PostFooter.vue';

const props = defineProps<{
  isOpen: boolean;
  post: Post;
}>();
const emits = defineEmits(['update:isOpen']);

const display = useDisplay();
const authStore = useAuthStore();
const userProfileStore = useUserProfileStore();
const { profile } = storeToRefs(userProfileStore);
const showDeleteConfirmation = ref<boolean>(false);
const commentListRef = ref();

const visitingOwnProfileAndAuth = computed(() => {
  return authStore && authStore.userInfo?.username === profile?.value?.username;
});
const isMediumAndAbove = computed(() => {
  return display.mdAndUp.value;
});
const isSmallAndBelow = computed(() => {
  return display.smAndDown.value;
});

const scrollToBottom = () => {
  commentListRef.value.$el.scrollTop = commentListRef.value.$el.scrollHeight;
};

const closeDialog = () => {
  emits('update:isOpen', false);
};

const confirmDelete = () => {
  showDeleteConfirmation.value = true;
};

const handleDeletePost = async () => {
  if (!props.post.id) return;
  await userProfileStore.deletePost(props.post.id);
  showDeleteConfirmation.value = false;
  closeDialog();
};
</script>

<style scoped lang="scss">
.v-dialog {
  .close-button {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99;
  }

  .v-alert {
    z-index: 9999;
    :deep(.v-alert__prepend) {
      display: none;
    }
  }
}
</style>