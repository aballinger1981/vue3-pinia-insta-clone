import { defineStore } from "pinia";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { firestore, auth } from "@/firebase/firebase";
import { toast } from 'vue3-toastify';
import router from "@/router";

export const useAuthStore = defineStore('auth', {
  state: () => {
    const user = localStorage.getItem('user-info');
    return {
      loading: false,
      authUser: user ? JSON.parse(user) : null,
    }
  },
  getters: {
    userInfo: (state) => state.authUser,
    isLoading: (state) => state.loading,
  },
  actions: {
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    setUser(user: any) {
      this.authUser = user;
    },
    async signup(inputs: any) {
      if (!inputs.email || !inputs.password || !inputs.username || !inputs.fullName) {
        toast.error("Please fill in all fields");
        return;
      }
      this.setLoading(true);
      const usersRef = collection(firestore, 'users');
      const q = query(usersRef, where('username', '==', inputs.username));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error('Username already exists');
        this.setLoading(false);
        return;
      }
      try {
        const newUser = await createUserWithEmailAndPassword(auth, inputs.email, inputs.password);
        if (!newUser) {
          toast.error('An error occurred while creating your account');
          return;
        }
        if (newUser) {
          const userDoc = {
            uid: newUser.user.uid,
            email: inputs.email,
            username: inputs.username,
            fullName: inputs.fullName,
            bio: "",
            profilePictureURL: "",
            followers: [],
            following: [],
            posts: [],
            createdAt: Date.now(),
          };
          await setDoc(doc(firestore, 'users', newUser.user.uid), userDoc);
          localStorage.setItem('user-info', JSON.stringify(userDoc));
          this.setUser(userDoc);
        }
      } catch (error: any) {
        toast.error(error.message);
      } finally {
        this.setLoading(false);
        router.push('/');
      }
    },
    async login(inputs: any) {
      if (!inputs.email || !inputs.password) {
        toast.error('Please enter your email and password');
        return;
      }
      this.setLoading(true);
      try {
        const userCredentials = await signInWithEmailAndPassword(
          auth,
          inputs.email,
          inputs.password,
        );
        if (userCredentials) {
          const docRef = doc(firestore, 'users', userCredentials.user.uid);
          const docSnap = await getDoc(docRef);
          localStorage.setItem('user-info', JSON.stringify(docSnap.data()));
          this.setUser(docSnap.data());
          router.push('/');
        }
      } catch (error) {
        toast.error('Invalid email or password');
      } finally {
        this.setLoading(false);
      }
    },
    async logout() {
      await signOut(auth);
      localStorage.removeItem('user-info');
      this.setUser(null);
      router.push('/auth');
    },
  }
});