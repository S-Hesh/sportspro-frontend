// src/hooks/useUserProfile.ts
import { useQuery } from "@tanstack/react-query";
import axiosClient from "../api/axiosClient";

// Types for dynamic part
interface UserCoreProfile {
  name: string;
  avatar: string;
  title: string;
  location: string;
  joined: string;
  bio: string;
  skills: string[];
}

// Fetch function using backend for core profile data
const fetchUserProfile = async () => {
  const response = await axiosClient.get<UserCoreProfile>("/users/profile");
  const core = response.data;

  // Combine dynamic and static parts
  return {
    name: core.name,
    avatar: core.avatar,
    title: core.title,
    location: core.location,
    joined: core.joined,
    bio: core.bio,
    skills: core.skills,
    achievements: [
      { title: "State Championship", year: "2023", sport: "Basketball" },
      { title: "MVP Award", year: "2022", sport: "Basketball" },
      { title: "All-Star Selection", year: "2021", sport: "Basketball" },
    ],
    stats: [
      { label: "Games Played", value: "156" },
      { label: "Points Per Game", value: "24.8" },
      { label: "Assists", value: "342" },
      { label: "Championships", value: "3" }
    ],
    recentActivity: [
      {
        type: "post",
        message: "posted about training session",
        time: "2 hours ago",
      },
      {
        type: "connect",
        message: "connected with Marcus Johnson",
        time: "1 day ago",
      }
    ]
  };
};

export function useUserProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });
}
