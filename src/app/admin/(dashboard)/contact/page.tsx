"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminErrorState, AdminLoadingState } from "@/components/admin/admin-loading-state";
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
import { Mail, User, Building2, Calendar, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  topic: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}



export default function AdminContactPage() {
  const [contacts, setContacts] = React.useState<ContactInquiry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/contact");
        if (!res.ok) {
          throw new Error("Failed to load contacts");
        }
        const response = await res.json();
        setContacts(response.data);
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
      const res = await fetch(`/api/admin/contact?id=${encodeURIComponent(deleteId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete contact inquiry");
      }
      // Optimistic update
      setContacts((prev) => prev.filter((c) => c.id !== deleteId));
      toast({
        title: "Contact inquiry deleted",
        description: "The contact inquiry has been deleted successfully.",
      });
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred while deleting the contact inquiry.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <AdminErrorState
        title="Unable to load contact inquiries"
        description="We couldn't reach the database right now. Please try again in a moment."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Contact Inquiries</h1>
        <p className="text-muted-foreground">View and manage all contact form submissions.</p>
      </div>

      {loading ? (
        <AdminLoadingState rows={5} itemClassName="h-4 w-24" />
      ) : contacts.length === 0 ? (
        <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Mail className="h-10 w-10 text-muted-foreground/40 mb-4" />
            <p className="text-sm text-muted-foreground">No contact inquiries yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {contacts.map((contact) => (
            <Card key={contact.id} className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{contact.name}</span>
                      {contact.company && (
                        <>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{contact.company}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3.5 w-3.5" />
                      <span>{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(contact.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-0.5">{contact.topic}</Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(contact.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete this contact inquiry?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete the contact inquiry.
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
                  </div>
                </div>
              </CardHeader>
              {expandedId === contact.id && (
                <CardContent>
                  <div className="p-4 rounded-lg bg-secondary/30 border border-border/60">
                    <p className="text-sm">{contact.message}</p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
