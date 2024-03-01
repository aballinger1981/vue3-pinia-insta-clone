import { firestore } from "@/firebase/firebase";
import { useAuthStore } from "@/stores/auth";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { defineStore } from "pinia";
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

export const useFollowUserStore = defineStore('followUser', () => {
  const isUpdatingFollowingUser = ref<boolean>(false);
  const authStore = useAuthStore();

  const isFollowing = (userId: string): boolean => {
    return authStore?.userInfo?.following.includes(userId);
  };

  const handleFollowUser = async (userId: string): Promise<void> => {
    isUpdatingFollowingUser.value = true;
    try {
      const currentUserRef = doc(firestore, 'users', authStore.userInfo.uid);
      const userToFollowOrUnfollowRef = doc(firestore, 'users', userId);
      await updateDoc(currentUserRef, {
        following: isFollowing(userId) ? arrayRemove(userId) : arrayUnion(userId),
      });
      await updateDoc(userToFollowOrUnfollowRef, {
        followers: isFollowing(userId) ? arrayRemove(authStore.userInfo.uid) : arrayUnion(authStore.userInfo.uid),
      });
      if (isFollowing(userId)) {
        authStore.setUser({
          ...authStore.userInfo,
          following: authStore.userInfo.following.filter((uid: string) => uid !== userId),
        });
        localStorage.setItem('user-info', JSON.stringify({
          ...authStore.userInfo,
          following: authStore.userInfo.following.filter((uid: string) => uid !== userId),
        }));
      } else {
        authStore.setUser({
          ...authStore.userInfo,
          following: [...authStore.userInfo.following, userId],
        });
        localStorage.setItem('user-info', JSON.stringify({
          ...authStore.userInfo,
          following: [...authStore.userInfo.following, userId],
        }));
      }
    } catch (error) {
      toast.error('An error occurred while following the user');
    } finally {
      isUpdatingFollowingUser.value = false;
    }
  };

  return {
    isUpdatingFollowingUser,
    isFollowing,
    handleFollowUser,
  }
});