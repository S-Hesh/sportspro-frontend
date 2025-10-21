import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X, Users } from "lucide-react";
import { getPending, acceptFromUser, rejectFromUser, type PendingRequest } from "@/api/connections";

const ConnectionRequestsDialog = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: requests = [], isLoading } = useQuery<PendingRequest[]>({
    queryKey: ["pendingRequests", "incoming"],
    queryFn: () => getPending("incoming"),
    enabled: open,
  });

  const acceptMut = useMutation({
    mutationFn: (otherId: number) => acceptFromUser(otherId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingRequests", "incoming"] });
      qc.invalidateQueries({ queryKey: ["networkUsers"] });
    },
  });

  const rejectMut = useMutation({
    mutationFn: (otherId: number) => rejectFromUser(otherId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pendingRequests", "incoming"] });
      qc.invalidateQueries({ queryKey: ["networkUsers"] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="relative">
          <Users className="w-4 h-4 mr-2" />
          Connection Requests
          {requests.length > 0 && (
            <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 min-w-[20px] h-5">
              {requests.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Connection Requests {isLoading ? "" : `(${requests.length})`}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading…</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No pending connection requests</p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.connectionId} className="flex items-start space-x-4 p-4 border rounded-lg hover:bg-gray-50">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={r.avatar} />
                  <AvatarFallback>{r.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{r.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{r.role}</p>
                  <p className="text-xs text-gray-500 mb-2">{r.location}</p>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {r.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {r.mutualConnections} mutual connections • {r.requestDate}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => acceptMut.mutate(r.requesterId)}
                        disabled={acceptMut.isPending}
                      >
                        <Check className="w-4 h-4 mr-1" /> Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => rejectMut.mutate(r.requesterId)}
                        disabled={rejectMut.isPending}
                      >
                        <X className="w-4 h-4 mr-1" /> Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConnectionRequestsDialog;
