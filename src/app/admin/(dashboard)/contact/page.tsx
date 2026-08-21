"use client";

import * as React from "react";
import {
  Mail,
  User,
  Building2,
  Calendar,
  Trash2,
  Search,
  Filter,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Eye,
  MessageSquare,
  Phone,
  Database,
  X,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

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

interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export default function AdminContactPage() {
  const [contacts, setContacts] = React.useState<ContactInquiry[]>([]);
  const [pagination, setPagination] = React.useState<Pagination | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [topic, setTopic] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const [viewContact, setViewContact] = React.useState<ContactInquiry | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const { toast } = useToast();

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        search,
        topic: topic === "all" ? "" : topic,
      });
      const res = await fetch(`/api/admin/contact?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load contacts");
      const response = await res.json();
      setContacts(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [page, search, topic]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/contact?id=${encodeURIComponent(deleteId)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete inquiry");
      setContacts((prev) => prev.filter((c) => c.id !== deleteId));
      toast({
        title: "Deleted successfully",
        description: "The inquiry has been removed.",
      });
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Deletion failed",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#003D3C]">Contact Inquiries</h1>
          <p className="text-muted-foreground mt-1">Manage and respond to general messages from the contact form.</p>
        </div>
        <Button 
          onClick={() => fetchData()} 
          variant="outline" 
          className="gap-2 self-start sm:self-auto"
          disabled={loading}
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* FILTERS */}
      <Card className="border-border/60 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, email, or message..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9 bg-muted/5"
            />
            {search && (
              <button 
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="w-full sm:w-[200px]">
            <Select 
              value={topic} 
              onValueChange={(v) => {
                setTopic(v);
                setPage(1);
              }}
            >
              <SelectTrigger className="bg-muted/5">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <SelectValue placeholder="All Topics" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Topics</SelectItem>
                <SelectItem value="services">Services</SelectItem>
                <SelectItem value="partnership">Partnership</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="border-border/60 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/60">
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sender</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Topic</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Preview</th>
                <th className="p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4"><Skeleton className="h-10 w-48" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-64" /></td>
                    <td className="p-4 text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md" /></td>
                  </tr>
                ))
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="size-12 rounded-full bg-muted flex items-center justify-center">
                        <Mail className="h-6 w-6 text-muted-foreground/40" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">No inquiries found</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-muted/20 transition-colors group">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{formatDate(contact.createdAt)}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#003D3C]">{contact.name}</span>
                        <span className="text-xs text-muted-foreground">{contact.email}</span>
                        {contact.company && (
                          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                            <Building2 className="h-3 w-3" />
                            {contact.company}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize text-[10px] font-medium bg-background">
                        {contact.topic}
                      </Badge>
                    </td>
                    <td className="p-4 max-w-xs xl:max-w-md">
                      <p className="text-sm text-muted-foreground truncate">{contact.message}</p>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-[#003D3C]"
                          onClick={() => setViewContact(contact)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => setDeleteId(contact.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {pagination && pagination.pages > 1 && (
          <div className="p-4 border-t border-border/60 flex items-center justify-between bg-muted/10">
            <p className="text-xs text-muted-foreground">
              Showing <span className="font-medium">{(page - 1) * pagination.limit + 1}</span> to <span className="font-medium">{Math.min(page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.pages }).map((_, i) => (
                  <Button
                    key={i}
                    variant={page === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPage(i + 1)}
                    className={cn("h-8 w-8 p-0 text-xs", page === i + 1 && "bg-[#003D3C]")}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* VIEW DIALOG */}
      <Dialog open={!!viewContact} onOpenChange={(open) => !open && setViewContact(null)}>
        <DialogContent className="max-w-2xl">
          {viewContact && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-[#003D3C] capitalize">{viewContact.topic}</Badge>
                  <span className="text-xs text-muted-foreground">{formatDate(viewContact.createdAt)}</span>
                </div>
                <DialogTitle className="text-2xl font-bold text-[#003D3C]">{viewContact.name}</DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                  <span className="flex items-center gap-1.5 text-foreground">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    {viewContact.email}
                  </span>
                  {viewContact.phone && (
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {viewContact.phone}
                    </span>
                  )}
                  {viewContact.company && (
                    <span className="flex items-center gap-1.5 text-foreground">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      {viewContact.company}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 p-6 rounded-xl bg-muted/30 border border-border/60 relative">
                <MessageSquare className="absolute -top-3 -left-3 h-8 w-8 text-[#003D3C]/10" />
                <p className="text-base leading-relaxed whitespace-pre-wrap">{viewContact.message}</p>
              </div>
              <DialogFooter className="mt-6">
                <Button asChild variant="default" className="bg-[#003D3C] rounded-full px-6">
                  <a href={`mailto:${viewContact.email}`}>Reply via Email</a>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <Trash2 className="h-5 w-5" />
              Delete Inquiry
            </DialogTitle>
            <DialogDescription className="py-3">
              Are you sure you want to delete this inquiry from <strong>{contacts.find(c => c.id === deleteId)?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button variant="outline" className="rounded-full">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={deleting}
              className="rounded-full px-6"
            >
              {deleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
