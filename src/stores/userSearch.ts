import { defineStore } from "pinia";
import { toast } from 'vue3-toastify';
import type { User } from '@/models/user';
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "@/firebase/firebase";

export const useSearchUserStore = defineStore('userSearch', {
  state: () => {
    return {
      loading: false,
      user: null as User | null,
    };
  },
  getters: {
    searchUser: (state) => state.user,
    isLoading: (state) => state.loading,
  },
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setSearchUser(user: any) {
      this.user = user;
    },
    async search(username: string) {
      this.setLoading(true);
      this.setSearchUser(null);
      try {
        const q = query(collection(firestore, 'users'), where('username', '==', username));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          toast.error('User not found');
          return;
        }
        querySnapshot.forEach((doc) => {
          this.setSearchUser(doc.data() as User);
        });
      } catch (error) {
        toast.error('An error occurred while searching for the user');
        this.setSearchUser(null);
      } finally {
        this.setLoading(false);
      }
    },
  }
});