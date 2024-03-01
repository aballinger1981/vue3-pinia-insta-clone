export interface User {
  id?: string;
  uid: string;
  email: string;
  username: string;
  fullName: string;
  bio: string;
  profilePictureURL: string;
  followers: string[];
  following: string[];
  posts: string[];
  createdAt: number;
}