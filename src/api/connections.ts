import axiosClient from "@/api/axiosClient";

export type Direction = "incoming" | "outgoing";

export interface PendingRequest {
  connectionId: number;
  requesterId: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  skills: string[];
  mutualConnections: number;
  requestDate: string;
}

export async function sendConnection(targetUserId: number) {
  const { data } = await axiosClient.post(`/connections/${targetUserId}`);
  return data;
}

export async function acceptFromUser(otherUserId: number) {
  const { data } = await axiosClient.post(`/connections/user/${otherUserId}/accept`);
  return data;
}

export async function rejectFromUser(otherUserId: number) {
  const { data } = await axiosClient.post(`/connections/user/${otherUserId}/reject`);
  return data;
}

export async function cancelOrRemove(targetUserId: number) {
  await axiosClient.delete(`/connections/${targetUserId}`);
  return true;
}

export async function getPending(direction: Direction = "incoming") {
  const { data } = await axiosClient.get(`/connections/pending`, { params: { direction } });
  return data as PendingRequest[];
}
