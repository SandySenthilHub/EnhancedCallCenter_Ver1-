import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Inbox, CheckCircle, XCircle, Forward, RotateCcw, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function InboxPage() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [action, setAction] = useState<string>("");
  const [comments, setComments] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: inboxItems = [], isLoading } = useQuery({
    queryKey: ["/api/inbox"],
  });

  const processItemMutation = useMutation({
    mutationFn: async ({ itemId, action, comments }: { itemId: number; action: string; comments?: string }) => {
      return apiRequest("POST", `/api/inbox/${itemId}/process`, { action, comments });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inbox"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sent-items"] });
      setActionDialogOpen(false);
      setComments("");
      toast({
        title: "Success",
        description: "Item processed successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process item",
        variant: "destructive",
      });
    },
  });

  const handleAction = (item: any, actionType: string) => {
    setSelectedItem(item);
    setAction(actionType);
    setActionDialogOpen(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "destructive";
      case "high": return "destructive";
      case "medium": return "default";
      case "low": return "secondary";
      default: return "default";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "default";
      case "approved": return "default";
      case "rejected": return "destructive";
      case "forwarded": return "secondary";
      case "returned": return "outline";
      default: return "default";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading inbox...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Inbox className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Inbox</h1>
          <Badge variant="outline">{inboxItems.length} items</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {inboxItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No items in inbox</h3>
              <p className="text-sm text-muted-foreground">All caught up! You have no pending items.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Pending Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {inboxItems.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{item.subject}</div>
                          {item.message && (
                            <div className="text-sm text-muted-foreground truncate max-w-xs">
                              {item.message}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{item.fromUser?.firstName} {item.fromUser?.lastName}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.itemType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getPriorityColor(item.priority)}>{item.priority}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(item.status)}>{item.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {item.dueDate ? (
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(item.dueDate).toLocaleDateString()}</span>
                          </div>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {item.status === "pending" && (
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(item, "approved")}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(item, "rejected")}
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(item, "forwarded")}
                            >
                              <Forward className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAction(item, "returned")}
                            >
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {action === "approved" && "Approve Item"}
              {action === "rejected" && "Reject Item"}
              {action === "forwarded" && "Forward Item"}
              {action === "returned" && "Return Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <p className="text-sm text-muted-foreground">{selectedItem?.subject}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Comments</label>
              <Textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Add your comments..."
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setActionDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedItem) {
                    processItemMutation.mutate({
                      itemId: selectedItem.id,
                      action,
                      comments,
                    });
                  }
                }}
                disabled={processItemMutation.isPending}
              >
                {processItemMutation.isPending ? "Processing..." : "Confirm"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}