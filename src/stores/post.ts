import { ref as refVue } from "vue";
import { defineStore } from "pinia";
import { toast } from 'vue3-toastify';
import { useAuthStore } from "./auth";
import { useUserProfileStore } from "./userProfile";
import type { Post } from "@/models/post";
import type { Comment } from "@/models/comment";
import { addDoc, arrayUnion, collection, doc, query, updateDoc, where, getDocs, arrayRemove } from "firebase/firestore";
import { firestore, storage } from "@/firebase/firebase";
import { getDownloadURL, uploadString, ref } from "firebase/storage";
import { useRoute } from "vue-router";

export const usePostStore = defineStore('post', () => {
  const route = useRoute();
  const authStore = useAuthStore();
  const userProfileStore = useUserProfileStore();
  const isCreatingPost = refVue<boolean>(false);
  const isGettingPosts = refVue<boolean>(false);
  const isCommenting = refVue<boolean>(false);
  const posts = refVue<Post[]>([]);

  const resetPosts = (): void => {
    posts.value = [];
  };

  const removePost = (postId: string): void => {
    const postIndex = posts.value.findIndex((post) => post.id === postId);
    if (postIndex >= 0) {
      posts.value.splice(postIndex, 1);
    }
  };

  const addComment = async (postId: string, comment: string): Promise<void> => {
    if (!authStore.userInfo) {
      toast.error('You must be logged in to comment on a post');
      return;
    }
    const newComment: Comment = {
      comment,
      createdAt: Date.now(),
      createdBy: authStore.userInfo.uid,
      postId,
    };
    isCommenting.value = true;
    try {
      await updateDoc(doc(firestore, 'posts', postId), {
        comments: arrayUnion(newComment),
      });
      const postIndex = posts.value.findIndex((post) => post.id === postId);
      if (postIndex >= 0) {
        posts.value[postIndex].comments = [...posts.value[postIndex].comments, newComment];
      }
    } catch (error) {
      toast.error('An error occurred while posting the comment');
    } finally {
      isCommenting.value = false;
    }
  };

  const updateLikes = async (post: Post): Promise<void> => {
    if (!authStore.userInfo) {
      toast.error('You must be logged in to like a post');
    }
    try {
      const likes = refVue<string[]>(post.likes);
      const isLiked = refVue<boolean>(post.likes.includes(authStore.userInfo?.uid));
        const postRef = doc(firestore, 'posts', post.id ?? '');
        await updateDoc(postRef, {
          likes: isLiked.value ? arrayRemove(authStore.userInfo.uid) : arrayUnion(authStore.userInfo.uid),
        })
        isLiked.value = !isLiked.value;
        const index = likes.value.indexOf(authStore.userInfo.uid);
        if (index >= 0) {
          likes.value.splice(index, 1);
        } else {
          likes.value.push(authStore.userInfo.uid);
        }
        const postIndex = posts.value.findIndex((postToUpdate) => postToUpdate.id === post.id);
        if (postIndex >= 0) {
          posts.value[postIndex].likes = [...likes.value];
        }
      } catch (error) {
        toast.error('An error occurred while updating likes');
      }
  };

  const getPosts = async (): Promise<void> => {
    if (!authStore.userInfo || authStore.userInfo.following.length === 0) {
      posts.value = [];
      return;
    }
    isGettingPosts.value = true;
    const q = query(collection(firestore, 'posts'), where('createdBy', 'in', authStore.userInfo.following));
    try {
      const querySnapshot = await getDocs(q);
      const feedPosts: Post[] = [];
      querySnapshot.forEach((doc) => {
        feedPosts.push({ ...doc.data(), id: doc.id } as Post);
      });
      posts.value = feedPosts.sort((a, b) => b.createdAt - a.createdAt);
    } catch (error) {
      toast.error('An error occurred while getting posts');
    } finally {
      isGettingPosts.value = false;
    }
  };

  const createPost = async (post: { caption: string, imageUrl: string }): Promise<void> => {
    if (!post.imageUrl) {
      toast.error('Please select an image');
      return;
    }
    if (isCreatingPost.value || !authStore.userInfo) return;
    isCreatingPost.value = true;
    const newPost: Post = {
      caption: post.caption,
      likes: [],
      comments: [],
      createdAt: Date.now(),
      createdBy: authStore.userInfo.uid,
    };
    try {
      const postDocumentRef = await addDoc(collection(firestore, 'posts'), newPost);
      const userDocRef = doc(firestore, 'users', authStore.userInfo.uid);
      const imageRef = ref(storage, `posts/${postDocumentRef.id}`);
      await updateDoc(userDocRef, { posts: arrayUnion(postDocumentRef.id) });
      await uploadString(imageRef, post.imageUrl, 'data_url');
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(postDocumentRef, { imageUrl: downloadURL });
      newPost.imageUrl = downloadURL;
      if (userProfileStore?.profile?.uid === authStore.userInfo.uid) {
        posts.value = [...posts.value, { ...newPost, id: postDocumentRef.id }];
      }
      if (route.path !== '/' && userProfileStore?.profile?.uid === authStore.userInfo.uid) {
        userProfileStore.addPost({ ...newPost, id: postDocumentRef.id });
      }
    } catch (error) {
      toast.error('An error occurred while creating the post');
    } finally {
      isCreatingPost.value = false;
    }
  };

  return { isCreatingPost, posts, createPost, getPosts, isGettingPosts, addComment, updateLikes, isCommenting, removePost, resetPosts };
});