// src/pages/Index.tsx

import React, { useState, useRef } from "react";
import usePosts from "@/hooks/usePosts";
import type { CreatePostRequest } from "@/types/posts";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Share2, Plus, Trophy, Users, Star } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axiosClient from "@/api/axiosClient";
import UserAvatar from "@/components/UserAvatar";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);

const Feed = () => {
  const [newPost, setNewPost] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const { posts, loading, create } = usePosts();
  const me = JSON.parse(localStorage.getItem("user") || "{}");
  const myAvatar = me.avatar;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  const handlePost = async () => {
    if (!newPost.trim()) return;

    let imageUrl = "";
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      try {
        const response = await axiosClient.post("/posts/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = response.data;
      } catch (error) {
        console.error("Image upload failed", error);
      }
    }

    const req: CreatePostRequest = { content: newPost.trim(), imageUrl };
    await create(req);
    setNewPost("");
    setImage(null);
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  //Show landing page if not logged in
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-8">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SportsPro</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
              Connect with athletes, coaches, and sports professionals worldwide. Share your journey, discover opportunities, and build your sports network.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button 
                onClick={() => navigate('/auth')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3"
              >
                Join SportsPro
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/auth')}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3"
              >
                Sign In
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Connect & Network</h3>
              <p className="text-gray-600">Build meaningful connections with athletes, coaches, and sports professionals from around the world.</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Share Your Journey</h3>
              <p className="text-gray-600">Document your achievements, training sessions, and milestones with our sports-focused community.</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Discover Opportunities</h3>
              <p className="text-gray-600">Find training programs, sponsorship deals, coaching positions, and career opportunities.</p>
            </Card>
          </div>

          <div className="text-center">
            <p className="text-gray-500 mb-4">Login or Register Now!</p>
            <Button 
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              Get Started!
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user → show feed
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Create Post */}
      <Card className="mb-6">
        <CardHeader className="flex items-start space-x-3">
          <UserAvatar src={myAvatar} name={me.name} className="w-10 h-10" />
          <Textarea
            placeholder="Share your sports journey, achievements, or opportunities..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="flex-1 min-h-[80px] resize-none"
          />
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="ghost" size="sm" onClick={handlePhotoClick} className="flex items-center space-x-1">
            <Plus className="w-4 h-4" />
            <span>Photo</span>
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
            className="hidden"
          />
          <Button onClick={handlePost} disabled={!newPost.trim()}>
            Post
          </Button>
        </CardFooter>
      </Card>

      {/* Posts Feed */}
      {loading ? (
        <div className="text-center">Loading…</div>
      ) : (
        posts.map((post) => (
          <Card key={post.postId} className="mb-6 hover:shadow-md transition-shadow">
            <CardHeader className="flex items-center space-x-3">
              <UserAvatar
                src={post.authorAvatar}
                name={post.authorName}
                className="w-10 h-10"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{post.authorName}</h3>
                <p className="text-xs text-gray-500">{dayjs(post.createdAt).fromNow()}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-gray-800">{post.content}</p>
              {post.imageUrl && (
                <img
                  src={`http://localhost:8080/uploads/${post.imageUrl}`}
                  alt="Post"
                  className="w-full h-auto"
                />
              )}
              {post.tags &&
                post.tags.split(",").map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
            </CardContent>
            <CardFooter className="flex items-center space-x-6 pt-4 border-t">
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-600 hover:text-red-500">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-600 hover:text-blue-500">
                <MessageSquare className="w-4 h-4" />
                <span>{post.commentsCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center space-x-1 text-gray-600 hover:text-green-500">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </Button>
            </CardFooter>
          </Card>
        ))
      )}
    </div>
  );
};

export default Feed;
