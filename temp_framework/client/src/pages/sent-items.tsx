import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Send, Clock } from "lucide-react";

export default function SentItemsPage() {
  const { data: sentItems = [], isLoading } = useQuery({
    queryKey: ["/api/sent-items"],
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case "sent": return "default";
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
          <p className="mt-2 text-sm text-muted-foreground">Loading sent items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Send className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Sent Items</h1>
          <Badge variant="outline">{sentItems.length} items</Badge>
        </div>
      </div>

      <div className="grid gap-4">
        {sentItems.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Send className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No sent items</h3>
              <p className="text-sm text-muted-foreground">You haven't sent any workflow items yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sent Items History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Date Sent</TableHead>
                    <TableHead>Original Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentItems.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.inboxItem?.subject || "N/A"}
                      </TableCell>
                      <TableCell>
                        {item.toUser?.firstName} {item.toUser?.lastName}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getActionColor(item.action)}>{item.action}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs truncate">
                          {item.comments || "-"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.inboxItem?.status || "unknown"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}