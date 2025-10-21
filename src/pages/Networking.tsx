// src/pages/Networking.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, UserPlus, Check, X, UserCheck } from "lucide-react";
import ConnectionRequestsDialog from "@/components/ConnectionRequestDialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/api/axiosClient";
import { sendConnection, acceptFromUser, rejectFromUser, cancelOrRemove } from "@/api/connections";

interface NetworkUser {
  id: number;
  name: string;
  role: string;
  location: string;
  avatar: string;
  skills: string[];
  connections: number;
  isConnected: boolean;
  hasIncomingRequest?: boolean;
  hasOutgoingRequest?: boolean;
}

const Networking = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const qc = useQueryClient();

  const { data: athletes = [], isLoading } = useQuery<NetworkUser[]>({
    queryKey: ["networkUsers"],
    queryFn: async () => {
      const { data } = await axiosClient.get("/users/networking");
      return data;
    },
  });

  const sendMut = useMutation({
    mutationFn: (targetId: number) => sendConnection(targetId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["networkUsers"] });
      qc.invalidateQueries({ queryKey: ["pendingRequests", "incoming"] });
    },
  });

  const acceptMut = useMutation({
    mutationFn: (otherId: number) => acceptFromUser(otherId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["networkUsers"] });
      qc.invalidateQueries({ queryKey: ["pendingRequests", "incoming"] });
    },
  });

  const rejectMut = useMutation({
    mutationFn: (otherId: number) => rejectFromUser(otherId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["networkUsers"] });
      qc.invalidateQueries({ queryKey: ["pendingRequests", "incoming"] });
    },
  });

  const cancelMut = useMutation({
    mutationFn: (targetId: number) => cancelOrRemove(targetId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["networkUsers"] });
      qc.invalidateQueries({ queryKey: ["pendingRequests", "outgoing"] });
    },
  });

  const filtered = searchQuery.trim()
    ? athletes.filter(a => {
        const q = searchQuery.toLowerCase();
        return (
          a.name.toLowerCase().includes(q) ||
          (a.role || "").toLowerCase().includes(q) ||
          (a.location || "").toLowerCase().includes(q) ||
          (a.skills || []).some(s => s.toLowerCase().includes(q))
        );
      })
    : athletes;

  const suggestions = [
    { name: "Ravindu Bandara", role: "Sports Nutritionist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=face", mutualConnections: 12 },
    { name: "Amandi Perera", role: "Physiotherapist",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=64&h=64&fit=crop&crop=face", mutualConnections: 8 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Network</h1>
            <p className="text-gray-600">Connect with athletes, coaches, and sports professionals</p>
          </div>
          <ConnectionRequestsDialog />
        </div>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search by name, sport, location, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle>Your Connections</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-600">Total</span><span className="font-semibold">—</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Athletes</span><span className="font-semibold">—</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Coaches</span><span className="font-semibold">—</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Other</span><span className="font-semibold">—</span></div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>People You May Know</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((p, i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10"><AvatarImage src={p.avatar} /><AvatarFallback>{p.name.split(" ").map(n => n[0]).join("")}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.name}</p>
                      <p className="text-xs text-gray-500 truncate">{p.role}</p>
                      <p className="text-xs text-gray-400">{p.mutualConnections} mutual</p>
                    </div>
                    <Button size="sm" variant="default"><Plus className="w-3 h-3" /></Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cards */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="text-center col-span-full text-gray-500">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center col-span-full text-gray-500">No users found.</div>
            ) : (
              filtered.map((athlete) => (
                <Card key={athlete.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Avatar className="w-16 h-16 mx-auto mb-4">
                        <AvatarImage
                          src={athlete.avatar?.startsWith("/uploads/") ? `http://localhost:8080${athlete.avatar}` : athlete.avatar}
                        />
                        <AvatarFallback>{athlete.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                      </Avatar>

                      <h3 className="font-semibold text-gray-900 mb-1">{athlete.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{athlete.role}</p>
                      <p className="text-xs text-gray-500 mb-3">{athlete.location}</p>

                      <div className="flex flex-wrap justify-center gap-1 mb-4">
                        {athlete.skills.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>

                      <p className="text-xs text-gray-500 mb-4">{athlete.connections} connections</p>

                      {/* Primary action area */}
                      {athlete.isConnected ? (
                        <Button
                          size="sm"
                          className="w-full bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-400"
                          variant="default"
                          onClick={() => {
                            const ok = window.confirm(`Remove ${athlete.name} from friends?`);
                            if (ok) cancelMut.mutate(athlete.id);
                          }}
                          disabled={cancelMut.isPending}
                          title="Click to remove connection"
                        >
                          <UserCheck className="w-4 h-4 mr-2" /> Friends
                        </Button>
                      ) : athlete.hasIncomingRequest ? (
                        <div className="flex gap-2">
                          <Button
                            size="sm" className="w-1/2 bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => acceptMut.mutate(athlete.id)}
                            disabled={acceptMut.isPending}
                          >
                            <Check className="w-4 h-4 mr-1" /> Accept
                          </Button>
                          <Button
                            size="sm"
                            className="w-1/2"
                            variant="default"
                            onClick={() => rejectMut.mutate(athlete.id)}
                            disabled={rejectMut.isPending}
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                        </div>
                      ) : athlete.hasOutgoingRequest ? (
                        <div className="flex flex-col gap-2">
                          <Button size="sm" className="w-full" variant="default" disabled>
                            <UserPlus className="w-4 h-4 mr-2" /> Pending
                          </Button>
                          <Button
                            size="sm" variant="ghost"
                            onClick={() => cancelMut.mutate(athlete.id)}
                            disabled={cancelMut.isPending}
                          >
                            Cancel request
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => sendMut.mutate(athlete.id)}
                          disabled={sendMut.isPending}
                        >
                          <Plus className="w-4 h-4 mr-2" /> Connect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Networking;
