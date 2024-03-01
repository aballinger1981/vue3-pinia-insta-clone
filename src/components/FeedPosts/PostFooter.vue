<template>
  <v-list>
    <v-list-item class="pl-0 pr-0">
      <template v-slot:title>
        <SvgImage v-if="!isLiked" name="notificationsLogo" class="like-logo" @click="onLikePost" />
        <SvgImage v-else name="unlikeLogo" class="unlike-logo" @click="onLikePost" />
        <SvgImage name="commentLogo" class="ml-4 comment-logo" @click="commentTextField?.focus()" />
      </template>
      <template v-slot:default>
        <p class="text-subtitle-2 font-weight-bold">
          {{ post.likes.length }} {{ `${post.likes.length === 0 || post.likes.length > 1 ? 'likes' : 'like'}` }}
        </p>
        <span v-if="isProfilePage" class="text-subtitle-2">Posted {{ timeAgo(post.createdAt) }}</span>
        <span v-if="!isProfilePage && post.comments.length === 0" class="text-subtitle-2 font-weight-bold">
          {{ profile?.username }}
        </span>
        <span v-if="!isProfilePage && post.comments.length === 0" class="text-subtitle-2 ml-2">
          {{ post?.caption }}
        </span>
        <p v-else-if="!isProfilePage" class="view-comments text-subtitle-2 font-weight-light" @click="toggleViewComments">
          View{{ `${post.comments.length > 1 ? ' all' : ''}` }} {{ post.comments.length }} {{ `${post.comments.length > 1
            ? 'comments' : 'comment'}` }}
        </p>
        <CommentDialog v-if="isCommentDialogOpen" v-model="isCommentDialogOpen" :post="post" />
        <v-form  v-if="authStore.userInfo" @submit.prevent @keyup.enter="handleSubmitComment">
        <v-text-field v-model="comment" ref="commentTextField" class="w-100" single-line variant="underlined"
          density="compact" label="Add a comment...">
          <template v-slot:append-inner>
            <v-btn class="text-none" variant="text" color="primary" @click="handleSubmitComment" :disabled="!comment"
              :loading="isCommenting">
              Post
            </v-btn>
          </template>
        </v-text-field>
      </v-form>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import SvgImage from '@/assets/SvgImage.vue';
import { useAuthStore } from '@/stores/auth';
import type { Post } from '@/models/post';
import type { User } from '@/models/user';
import { usePostStore } from '@/stores/post';
import { useRoute } from 'vue-router';
import CommentDialog from '@/components/Comments/CommentDialog.vue';
import { timeAgo } from '@/utils/timeAgo';

const props = defineProps<{
  post: Post;
  profile: User;
}>();

const authStore = useAuthStore();
const postStore = usePostStore();
const { isCommenting } = storeToRefs(postStore);
const route = useRoute();
const comment = defineModel({ default: '' });
const commentTextField = ref<HTMLInputElement>();
const isCommentDialogOpen = ref<boolean>(false);

const isProfilePage = computed(() => {
  return route.name === 'profile';
});

const isLiked = computed(() => {
  return props.post.likes.includes(authStore.userInfo?.uid);
});

const toggleViewComments = () => {
  isCommentDialogOpen.value = !isCommentDialogOpen.value;
};

const handleSubmitComment = async (event: Event) => {
  event.preventDefault();
  if (!props.post || !props.post.id || !commentTextField.value) return;
  await postStore.addComment(props.post.id, comment.value);
  comment.value = '';
  commentTextField.value.blur();
};

const onLikePost = async () => {
  await postStore.updateLikes(props.post);
}
</script>

<style scoped lang="scss">
.like-logo,
.unlike-logo,
.comment-logo,
.view-comments {
  cursor: pointer;
}
</style>