// src/hooks/usePosts.ts
import { useState, useEffect, useCallback } from "react";
import axiosClient from "@/api/axiosClient";
import type { PostDTO, CreatePostRequest } from "@/types/posts";

export default function usePosts(page = 0, size = 10) {
  const [posts, setPosts] = useState<PostDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get<{
        content: PostDTO[];
        totalPages: number;
      }>("/posts", { params: { page, size } });
      setPosts(data.content);
      setTotalPages(data.totalPages);
    } finally {
      setLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const create = async (req: CreatePostRequest) => {
    await axiosClient.post<PostDTO>("/posts", req);
    await fetch();
  };

  return { posts, loading, totalPages, create };
}
