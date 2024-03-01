import type { Comment } from './comment';

export interface Post {
  id?: string;
  caption: string;
  comments: Comment[];
  createdAt: number;
  createdBy: string;
  imageUrl?: string;
  likes: string[];
}