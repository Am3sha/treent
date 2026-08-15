"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminErrorState, AdminLoadingState } from "@/components/admin/admin-loading-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus, Download, Calendar, Trash2 } from "lucide-react";
import { formatDate, csvEscape, downloadCsv } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface NewsletterSubscriber {
  id: string;
  email: string;
  source: string;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = React.useState<NewsletterSubscriber[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/newsletter");
        if (!res.ok) {
          throw new Error("Failed to load subscribers");
        }
        const response = await res.json();
        setSubscribers(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/newsletter?id=${encodeURIComponent(deleteId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete newsletter subscriber");
      }
      // Optimistic update
      setSubscribers((prev) => prev.filter((s) => s.id !== deleteId));
      toast({
        title: "Newsletter subscriber deleted",
        description: "The newsletter subscriber has been deleted successfully.",
      });
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred while deleting the newsletter subscriber.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = () => {
    if (subscribers.length === 0) return;
    const headers = ["Email", "Source", "Subscribed At"];
    const rows = subscribers.map((s) => [s.email, s.source, formatDate(s.createdAt)]);
    const csv = [headers, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");
    downloadCsv(csv, `trennt-newsletter-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  if (error) {
    return (
      <AdminErrorState
        title="Unable to load subscribers"
        description="We couldn't reach the database right now. Please try again in a moment."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Newsletter Subscribers</h1>
          <p className="text-muted-foreground">View all newsletter subscribers.</p>
        </div>
        <Button
          variant="outline"
          onClick={handleExportCsv}
          disabled={loading || subscribers.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-muted-foreground" />
            All Subscribers
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-4">
              <AdminLoadingState rows={5} itemClassName="h-3 w-28" className="space-y-3" />
            </div>
          ) : subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <UserPlus className="h-10 w-10 text-muted-foreground/40 mb-4" />
              <p className="text-sm text-muted-foreground">No newsletter subscribers yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead className="text-right">Subscribed At</TableHead>
                    <TableHead className="text-right w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subscribers.map((sub, index) => (
                    <TableRow key={sub.id}>
                      <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                      <TableCell className="font-medium">{sub.email}</TableCell>
                      <TableCell>{sub.source}</TableCell>
                      <TableCell className="text-right text-muted-foreground flex items-center justify-end gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(sub.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteId(sub.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete this newsletter subscriber?</DialogTitle>
                              <DialogDescription>
                                This action cannot be undone. This will permanently delete the newsletter subscriber.
                              </DialogDescription>
                            </DialogHeader>
<DialogFooter>
                               <DialogClose asChild>
                                 <Button variant="ghost" onClick={() => { setDeleteId(null); toast({ title: "Cancelled", description: "Deletion cancelled.", variant: "default" }); }}>
                                   Cancel
                                 </Button>
                               </DialogClose>
                              <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={deleting}
                              >
                                {deleting ? "Deleting..." : "Delete"}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
