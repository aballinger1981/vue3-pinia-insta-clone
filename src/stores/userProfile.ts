import { ref as refVue } from "vue";
import type { User } from "@/models/user";
import type { Post } from "@/models/post";
import { useAuthStore } from "./auth";
import { usePostStore } from "./post";
import { defineStore } from "pinia";
import { toast } from "vue3-toastify";
import { collection, getDocs, query, where, getDoc, doc, updateDoc, deleteDoc, arrayRemove } from "firebase/firestore";
import { firestore, storage } from "@/firebase/firebase";
import { deleteObject, getDownloadURL, ref, uploadString } from "firebase/storage";

export const useUserProfileStore = defineStore('userProfile', () => {
  const isGettingUserProfileByName = refVue<boolean>(false);
  const isUpdatingProfile = refVue<boolean>(false);
  const isGettingProfilePosts = refVue<boolean>(false);
  const isDeletingPost = refVue<boolean>(false);
  const profile = refVue<User | null>(null);

  const resetProfile = (): void => {
    profile.value = null;
  };

  const addPost = (post: Post): void => {
    if (!profile.value || !post.id) return;
    profile.value = { ...profile.value, posts: [...profile.value.posts, post.id] };
  };

  const deletePost = async (postId: string) => {
    if (!profile.value || !postId) return;
    const authStore = useAuthStore();
    const postStore = usePostStore();
    isDeletingPost.value = true;
    try {
      const imageRef = ref(storage, `posts/${postId}`);
      await deleteObject(imageRef);
      const userRef = doc(firestore, 'users', authStore.userInfo.uid);
      await deleteDoc(doc(firestore, 'posts', postId));
      await updateDoc(userRef, {
        posts: arrayRemove(postId),
      });
      postStore.removePost(postId);
      profile.value = { ...profile.value, posts: profile.value.posts.filter((id) => id !== postId) };
      toast.success('Post deleted successfully');
    } catch (error) {
      toast.error('An error occurred while deleting post');
    } finally {
      isDeletingPost.value = false;
    }
  };

  const getProfilePosts = async () => {
    if (!profile.value) return;
    isGettingProfilePosts.value = true;
    const postStore = usePostStore();
    try {
      const q = query(collection(firestore, 'posts'), where('createdBy', '==', profile.value.uid));
      const querySnapshot = await getDocs(q);
      const posts: Post[] = [];
      querySnapshot.forEach((doc) => {
        posts.push({ ...doc.data() as Post, id: doc.id });
      });
      posts.sort((a, b) => b.createdAt - a.createdAt);
      postStore.posts = posts;
    } catch (error) {
      toast.error('An error occurred while getting profile posts');
      postStore.posts = [];
    } finally {
      isGettingProfilePosts.value = false;
    }
  };

  const editProfile = async (inputs: { fullName: string, username: string, bio: string }, selectedFile: string): Promise<void> => {
    const authStore = useAuthStore();
    if (!authStore.userInfo || isUpdatingProfile.value) return;
    const storageRef = ref(storage, `profilePics/${authStore.userInfo.uid}`);
    const userDocRef = doc(firestore, 'users', authStore.userInfo.uid);
    let URL = '';
    isUpdatingProfile.value = true;
    try {
      if (selectedFile) {
        await uploadString(storageRef, selectedFile, 'data_url');
        URL = await getDownloadURL(ref(storage, `profilePics/${authStore.userInfo.uid}`));
      }
      const updatedUser = {
        ...authStore.userInfo,
        fullName: inputs.fullName || authStore.userInfo.fullName,
        username: inputs.username || authStore.userInfo.username,
        bio: inputs.bio || authStore.userInfo.bio,
        profilePictureURL: URL || authStore.userInfo.profilePictureURL,
      };
      await updateDoc(userDocRef, updatedUser);
      localStorage.setItem('user-info', JSON.stringify(updatedUser));
      authStore.setUser(updatedUser);
      profile.value = updatedUser;
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('An error occurred while updating profile');
    } finally {
      isUpdatingProfile.value = false;
    }
  };

  const getUserProfileById = async (userId: string): Promise<{ isGettingUserProfileById: boolean, profileById: User | null } | null> => {
    const isGettingUserProfileById = refVue<boolean>(false);
    const profileById = refVue<User | null>(null);
    isGettingUserProfileById.value = true;
    try {
      const userRef = await getDoc(doc(firestore, 'users', userId));
      if (userRef.exists()) {
        profileById.value = userRef.data() as User;
      }
    } catch (error) {
      toast.error('An error occurred while getting user profile');
    } finally {
      isGettingUserProfileById.value = false;
    }
    return { isGettingUserProfileById: isGettingUserProfileById.value, profileById: profileById.value };
  };

  const getUserProfileByUsername = async (username: string): Promise<void> => {
    isGettingUserProfileByName.value = true;
    try {
      const q = query(collection(firestore, 'users'), where('username', '==', username));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        profile.value = null;
        toast.error('User not found');
        return;
      }
      let userDoc;
      querySnapshot.forEach((doc) => {
        userDoc = doc.data() as User;
      });
      if (!userDoc) return;
      profile.value = userDoc;
    } catch (error) {
      toast.error('An error occurred while getting user profile');
    } finally {
      isGettingUserProfileByName.value = false;
    }
  };

  return { profile, addPost, deletePost, getUserProfileById, getUserProfileByUsername, isGettingUserProfileByName, editProfile, isUpdatingProfile, getProfilePosts, isGettingProfilePosts, resetProfile };
});