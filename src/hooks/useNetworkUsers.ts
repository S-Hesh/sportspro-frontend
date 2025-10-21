import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";

export interface NetworkUser {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  skills: string[];
  connections: number;
  isConnected: boolean;
}

export const useNetworkUsers = () => {
  return useQuery<NetworkUser[]>({
    queryKey: ["networkUsers"],
    queryFn: async () => {
      const res = await axiosClient.get("/users/networking");
      return res.data;
    },
  });
};
