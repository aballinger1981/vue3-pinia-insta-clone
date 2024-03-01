<template>
  <v-list-item class="mt-3" link title="Create" prepend-icon="mdi-plus-box-outline">
    <v-dialog v-model="dialog" activator="parent" location-strategy="connected" transition="slide-x-transition"
      max-width="500px"  :max-height="isMediumAndAbove ? '1000' : '500'">
      <v-card class="pt-2 pb-2">
        <v-card-title class="d-flex ml-2">
          Create Post
          <v-spacer></v-spacer>
          <v-btn class="close-button" variant="text" icon="mdi-close" @click="dialog = false"></v-btn>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-textarea v-model="caption" label="Post Caption..." variant="outlined" density="compact"
            required></v-textarea>
        </v-card-text>
        <v-card-actions class="ml-4 pt-0 pb-0">
          <v-file-input class="image-input" prepend-icon="mdi-image" v-model="image" accept="image/*" label="Image" variant="outlined"
            dense @update:model-value="handleImageChange"></v-file-input>
        </v-card-actions>
        <v-list class="file-list ml-2 mr-2 pt-0">
          <v-list-item v-if="selectedFile">
            <v-img :src="(selectedFile as string)" width="100%" height="100%" cover aspect-ratio="1"/>
            <v-btn class="remove-image" variant="text" icon="mdi-close" @click="selectedFile = ''"></v-btn>
          </v-list-item>
          <v-list-item class="text-right pt-4">
            <v-spacer></v-spacer>
            <v-btn @click="handleCreatePost" color="primary" type="submit" :loading="isCreatingPost">
              Create
            </v-btn>
          </v-list-item>
        </v-list>
      </v-card>
    </v-dialog>
  </v-list-item>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDisplay } from 'vuetify';
import { getPreviewImage } from '@/utils/previewImage';
import { usePostStore } from '@/stores/post';
import { storeToRefs } from 'pinia';
import { toast } from 'vue3-toastify';

const display = useDisplay();
const postStore = usePostStore();
const { isCreatingPost } = storeToRefs(postStore);
const selectedFile = ref<string>('');
const dialog = ref<boolean>(false);
const caption = defineModel({ default: ''});
const image = ref();

const isMediumAndAbove = computed(() => {
  return display.mdAndUp.value;
});

const handleCreatePost = async () => {
  if (typeof caption.value !== 'string' || typeof selectedFile.value !== 'string') return;
  try {
    await postStore.createPost({ caption: caption.value, imageUrl: selectedFile.value });
    dialog.value = false;
    caption.value = '';
    selectedFile.value = '';
  } catch (error) {
    toast.error('Failed to create post');
  }
};

const handleImageChange = async () => {
  const file = await getPreviewImage(image.value);
  if (file) {
    selectedFile.value = file;
  }
};
</script>

<style scoped lang="scss">
.v-dialog {
  .close-button {
    position: absolute;
    top: 0;
    right: 0;
  }
  .remove-image {
    position: absolute;
    top: 0;
    right: 0;
    margin-right: .75rem;
  }

  .image-input {
    :deep(.v-input__control) {
      display: none;
    }
  }
}
</style>