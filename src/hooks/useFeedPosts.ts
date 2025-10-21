
import { useQuery } from "@tanstack/react-query";

// This function will eventually fetch from your real backend.
// For now, it returns mock data via a promise to simulate async fetch.
const fetchFeedPosts = async () => {
  // TODO: Replace this mock with your real API call.
  // Example with fetch: await fetch('/api/feed').then(res => res.json());
  return [
    {
      id: 1,
      author: "Marcus Johnson",
      role: "Professional Basketball Player",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      time: "2h",
      content: "Just finished an incredible training session! The dedication and hard work from my teammates is truly inspiring. Can't wait for the upcoming season! 🏀",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500&h=300&fit=crop",
      likes: 247,
      comments: 23,
      tags: ["Basketball", "Training", "TeamWork"]
    },
    {
      id: 2,
      author: "Sarah Chen",
      role: "Olympic Swimmer",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      time: "4h",
      content: "Proud to announce my partnership with AquaTech! Their innovative training equipment has been game-changing for my performance. Excited for what's ahead! 🏊‍♀️",
      likes: 189,
      comments: 31,
      tags: ["Swimming", "Partnership", "Innovation"]
    },
    // ... You can add more mock posts here
  ];
};

export function useFeedPosts() {
  return useQuery({
    queryKey: ["feedPosts"],
    queryFn: fetchFeedPosts,
  });
}
