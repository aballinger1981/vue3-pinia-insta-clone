import { ref, type Ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { User } from "@/models/user";
import { collection, orderBy, query, where, limit, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";
import { toast } from "vue3-toastify";

export const useGetSuggestedUsers = (): { isGettingSuggestedUsers: Ref<boolean>, suggestedUsers: Ref<User[]>} => {
  const authStore = useAuthStore();
  const suggestedUsers = ref<User[]>([]);
  const isGettingSuggestedUsers = ref<boolean>(false);

  const getSuggestedUsers = async () => {
    isGettingSuggestedUsers.value = true;
    try {
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('uid', 'not-in', [authStore.userInfo?.uid ?? '', ...(authStore.userInfo?.following ?? [])]), orderBy('uid'), limit(3));
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ ...doc.data() as User, id: doc.id });
      });
      suggestedUsers.value = users;
    } catch (error) {
      toast.error('An error occurred while getting suggested users');
    } finally {
      isGettingSuggestedUsers.value = false;
    }
  }

  watch(() => authStore?.userInfo?.following, async () => {
    await getSuggestedUsers();
  }, { immediate: true });
  
  return { isGettingSuggestedUsers, suggestedUsers };
};