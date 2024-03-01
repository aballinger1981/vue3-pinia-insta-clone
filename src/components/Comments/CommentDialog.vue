<template>
  <v-dialog :model-value="modelValue" max-width="600px">
    <v-card class="pt-2 pb-2">
      <v-card-title class="d-flex ml-2">
        Comments
        <v-spacer></v-spacer>
        <v-btn @click="closeDialog" class="close-button" icon="mdi-close">
        </v-btn>
      </v-card-title>
      <v-list ref="commentListRef" :style="{ 'max-height': '300px', 'overflow-y': 'auto' }">
        <template v-for="i in 5" :key="i">
          <v-skeleton-loader v-if="isCommenting" type="list-item-avatar-two-line">
          </v-skeleton-loader>
        </template>
        <template v-for="(comment, index) in post.comments" :key="index">
          <CommentComponent :comment="comment" />
        </template>
      </v-list>
      <v-list>
        <v-list-item class="pb-0">
          <v-text-field v-model="commentRef" single-line variant="outlined" density="compact" label="Comment"
            ref="commentTextFieldRef" />
        </v-list-item>
        <v-list-item class="text-right pt-0">
          <v-spacer></v-spacer>
          <v-btn @click="handleAddComment" color="primary" type="submit" :loading="isCommenting" :disabled="!commentRef">
            Add
          </v-btn>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import type { Post } from '@/models/post';
import CommentComponent from './CommentComponent.vue';
import { usePostStore } from '@/stores/post';

const props = defineProps<{
  post: Post;
  modelValue: boolean;
}>();
const emits = defineEmits(['update:modelValue']);

const postStore = usePostStore();
const { isCommenting } = storeToRefs(postStore);
const commentRef = ref<string>('');
const commentTextFieldRef = ref<HTMLInputElement>();
const commentListRef = ref();

onMounted(() => {
  commentTextFieldRef?.value?.focus();
  commentListRef.value.$el.scrollTop = commentListRef.value.$el.scrollHeight;
});

const closeDialog = () => {
  emits('update:modelValue', false);
};

const handleAddComment = async () => {
  if (!props.post || !props.post.id) return;
  await postStore.addComment(props.post.id, commentRef.value);
  commentRef.value = '';
  commentListRef.value.$el.scrollTop = commentListRef.value.$el.scrollHeight;
};
</script>

<style scoped lang="scss">
.v-dialog {
  .close-button {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>