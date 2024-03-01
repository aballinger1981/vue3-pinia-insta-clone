<template>
  <v-row>
    <v-col class="logo-text-container">
      <v-img class="google-image" src="/public/google.png" width="1.25rem" />
      <span class="google-text" @click="handleLogin">{{ prefix }} with Google</span>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, firestore } from '@/firebase/firebase';
import { toast } from 'vue3-toastify';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuthStore } from '@/stores/auth';

const props = defineProps<{
  prefix: string,
}>();

const authStore = useAuthStore();

const prefix = computed(() => props.prefix);

const handleLogin = async () => {
  try {
    const newUser = await signInWithPopup(auth, new GoogleAuthProvider());
    if (!newUser) {
      toast.error("User not found");
      return;
    }
    const userRef = doc(firestore, "users", newUser.user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userDoc = userSnap.data();
      localStorage.setItem("user-info", JSON.stringify(userDoc));
      authStore.setUser(userDoc);
    } else {
      const userDoc = {
        uid: newUser.user.uid,
        email: newUser.user.email,
        username: newUser?.user?.email?.split("@")[0],
        fullName: newUser.user.displayName,
        bio: "",
        profilePictureURL: newUser.user.photoURL,
        followers: [],
        following: [],
        posts: [],
        createdAt: Date.now(),
      };
      await setDoc(doc(firestore, "users", newUser.user.uid), userDoc);
      localStorage.setItem("user-info", JSON.stringify(userDoc));
      authStore.setUser(userDoc);
    }
  } catch (error: any) {
    toast.error(error.message);
  }
}

</script>

<style scoped lang="scss">
.google-image {
  flex: 0 0 auto;
}

.logo-text-container {
  display: flex;
  justify-content: center;

  span {
    color: lightblue;
    margin-left: .5rem;
  }
  .google-text {
    cursor: pointer;
  }
}
</style>