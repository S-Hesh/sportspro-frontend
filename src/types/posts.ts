// src/types/posts.ts
export interface PostDTO {
  postId: number;
  content: string;
  imageUrl?: string;
  likes: number;
  commentsCount: number;
  tags?: string;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  createdAt: string; // ISO date string
}

export interface CreatePostRequest {
  content: string;
  imageUrl?: string;
  tags?: string;
}
