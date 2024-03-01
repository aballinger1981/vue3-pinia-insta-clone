<template>
  <v-dialog :model-value="isOpen" width="500px">
    <v-card class="pt-4 pb-6">
      <v-card-title class="d-flex ml-6">
        Edit Profile
      </v-card-title>
      <v-list class="ml-4 mr-4">
        <v-list-item>
          <template v-slot:prepend>
            <v-avatar v-if="selectedFile" size="90">
              <v-img :src="(selectedFile as string)" width="100" height="100" />
            </v-avatar>
            <v-avatar v-else-if="!profile?.profilePictureURL" size="90">
              <v-icon icon="mdi-account-circle" size="90" />
            </v-avatar>
            <v-avatar v-else size="90">
              <v-img :src="profile?.profilePictureURL" width="100" height="100" />
            </v-avatar>
          </template>
          <template v-slot:default>
            <v-btn @click="handleChangeProfilePicture" class="text-none" variant="tonal">
              Edit Profile Picture
              <v-file-input id="uploader" class="image-input" v-model="image" accept="image/*" dense  @update:model-value="handlePreviewImage" variant="outlined" />
            </v-btn>
          </template>
        </v-list-item>
      </v-list>
      <v-form @submit.prevent class="ml-6 mr-6">
        <v-list>
          <v-list-item>
        <v-label>Full Name</v-label>
        <v-text-field v-model="fullName" single-line type="text" variant="outlined" density="compact" />
      </v-list-item>
      <v-list-item>
        <v-label>Username</v-label>
        <v-text-field v-model="username" single-line type="text" variant="outlined" density="compact" />
      </v-list-item>
      <v-list-item>
        <v-label>Bio</v-label>
        <v-text-field v-model="bio" single-line type="text" variant="outlined" density="compact" />
      </v-list-item>
      <v-list-item class="d-flex edit-profile-buttons">
        <v-btn class="mr-4" @click="closeDialog" variant="outlined">Cancel</v-btn>
        <v-btn @click="handleUpdateProfile" color="primary" type="submit" :loading="isUpdatingProfile">
          Submit
          </v-btn>
        </v-list-item>
        </v-list>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { getPreviewImage } from '@/utils/previewImage';
import { useUserProfileStore } from '@/stores/userProfile';

const userProfileStore = useUserProfileStore();
const { profile, isUpdatingProfile } = storeToRefs(userProfileStore);
const selectedFile = ref<string>('');
const fullName = defineModel<string>('fullName', { default: '' });
const username = defineModel<string>('username', { default: '' });
const bio = defineModel<string>('bio', { default: '' });
const image = ref();

defineProps<{
  isOpen: boolean;
}>();
const emits = defineEmits(['update:isOpen']);

const closeDialog = () => {
  emits('update:isOpen', false);
};

const handleChangeProfilePicture = () => {
  document.getElementById('uploader')?.click();
};

const handlePreviewImage = async () => {
  const file = await getPreviewImage(image.value);
  if (file) {
    selectedFile.value = file;
  }
};

const handleUpdateProfile = async () => {
  await userProfileStore.editProfile({
    fullName: fullName.value,
    username: username.value,
    bio: bio.value
  }, selectedFile.value);
  selectedFile.value = '';
  image.value = '';
  closeDialog();
};

watch(() => profile?.value, () => {
  if (!profile.value) return;
  fullName.value = profile?.value.fullName;
  username.value = profile.value.username;
  bio.value = profile.value.bio;
}, { immediate: true });
</script>

<style scoped lang="scss">
.v-dialog {
  .image-input {
    display: none;
    :deep(.v-input__control) {
      display: none;
    }
  }
  .edit-profile-buttons {
    :deep(.v-list-item__content) {
      display: flex;
      justify-content: flex-end;
      width: 100%;
    }
  }
}
</style>