"use client";

import * as React from "react";
import {
  RefreshCw,
  MoreVertical,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  X,
  Database,
  Mail,
  Filter,
  Calendar,
  Building2,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { AdminLoadingState } from "@/components/admin/admin-loading-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FollowUpRecord {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  message: string | null;
  interest: string;
  status: string;
  createdAt: string;
  assessment: {
    overallScore: number;
    tier: string;
    industry: string | null;
  };
}

interface FollowUpResponse {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  records: FollowUpRecord[];
}

const TIER_STYLES: Record<string, { label: string; color: string }> = {
  initial: { label: "Initial", color: "bg-red-500/10 text-red-700 border-red-500/20" },
  developing: { label: "Developing", color: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
  defined: { label: "Defined", color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" },
  established: { label: "Established", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  advanced: { label: "Advanced", color: "bg-teal-600/10 text-teal-700 border-teal-600/20" },
};

export default function AdminFollowUpsPage() {
  const [data, setData] = React.useState<FollowUpResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [status, setStatus] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [viewRecord, setViewRecord] = React.useState<FollowUpRecord | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const { toast } = useToast();

  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  React.useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", "10");
        if (debouncedSearch) params.set("search", debouncedSearch);
        if (status !== "all") params.set("status", status);
        
        const res = await fetch(`/api/admin/follow-ups?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("fetch failed");
        const json = (await res.json()) as { ok: boolean; data: FollowUpResponse };
        if (!active) return;
        setData(json.data);
        setError(false);
      } catch (error) {
        if (!active || (error instanceof DOMException && error.name === "AbortError")) return;
        setError(true);
      } finally {
        if (active) setLoading(false);
      }
    };

    void fetchData();
    return () => {
      active = false;
      controller.abort();
    };
  }, [page, status, debouncedSearch, refreshKey]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((v) => v + 1);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/follow-ups?id=${encodeURIComponent(deleteId)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete follow-up");
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          total: prev.total - 1,
          records: prev.records.filter((r) => r.id !== deleteId),
        };
      });
      toast({ title: "Follow-up Deleted", description: "The record has been successfully deleted." });
      setDeleteId(null);
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "An error occurred", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003D3C]">Follow-Up Requests</h1>
          <p className="text-sm text-muted-foreground">Manage leads and follow-up requests from benchmarks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border/60 bg-muted/20 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, company, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Select value={status} onValueChange={(v) => { setPage(1); setStatus(v); }}>
              <SelectTrigger className="h-10 w-[140px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-8">
            <AdminLoadingState rows={8} />
          </div>
        ) : error ? (
          <div className="p-20 text-center">
            <p className="text-destructive">Failed to load follow-ups. Please try again.</p>
            <Button variant="link" onClick={handleRefresh}>Retry</Button>
          </div>
        ) : !data || data.records.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground">
            <Mail className="h-10 w-10 mx-auto mb-4 opacity-20" />
            <p>No follow-up requests found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/30 border-b border-border/60">
                  <tr className="text-left text-muted-foreground font-medium">
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Company</th>
                    <th className="px-4 py-3.5">Industry</th>
                    <th className="px-4 py-3.5 w-48">Parent Score</th>
                    <th className="px-4 py-3.5">Tier</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {data.records.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/10 transition-colors">
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-[#003D3C]">{r.company || "—"}</div>
                        <div className="text-xs text-muted-foreground">{r.name}</div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{r.assessment.industry || "—"}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Progress value={r.assessment.overallScore} className="h-1.5 flex-1 bg-muted" />
                          <span className="font-bold text-[#003D3C] w-8 text-right">{r.assessment.overallScore}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={cn("capitalize font-medium px-2 py-0.5 border", TIER_STYLES[r.assessment.tier.toLowerCase()]?.color)}>
                          {r.assessment.tier}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem onClick={() => setViewRecord(r)}>
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(r.id)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="p-4 border-t border-border/60 bg-muted/5 flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Showing <span className="font-medium text-foreground">{(page - 1) * data.pageSize + 1}</span> to{" "}
                <span className="font-medium text-foreground">{Math.min(page * data.pageSize, data.total)}</span> of{" "}
                <span className="font-medium text-foreground">{data.total}</span> results
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline-block">Page {data.page} of {data.totalPages}</span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setPage(p => Math.min(data.totalPages, p + 1))} disabled={page >= data.totalPages}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Detail Dialog */}
      <Dialog open={!!viewRecord} onOpenChange={(open) => !open && setViewRecord(null)}>
        <DialogContent className="max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#003D3C]">Follow-Up Request Details</DialogTitle>
            <DialogDescription>Request received on {viewRecord && new Date(viewRecord.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</DialogDescription>
          </DialogHeader>
          {viewRecord && (
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[#003D3C] mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Contact Info</p>
                      <p className="font-medium text-lg">{viewRecord.name}</p>
                      <p className="text-sm text-muted-foreground">{viewRecord.email}</p>
                      {viewRecord.phone && <p className="text-sm text-muted-foreground">{viewRecord.phone}</p>}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-[#003D3C] mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Organisation</p>
                      <p className="font-medium">{viewRecord.company || "—"}</p>
                      <p className="text-sm text-muted-foreground">{viewRecord.assessment.industry || "—"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-[#003D3C] mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Interest Area</p>
                      <Badge className="bg-[#ADDFB3]/20 text-[#003D3C] border-[#ADDFB3]/30 capitalize">
                        {viewRecord.interest}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-[#003D3C] mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">Assessment Score</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{viewRecord.assessment.overallScore}%</span>
                        <Badge variant="outline" className={cn("capitalize text-[10px] px-1.5 py-0 border", TIER_STYLES[viewRecord.assessment.tier.toLowerCase()]?.color)}>
                          {viewRecord.assessment.tier}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                <div className="flex items-center gap-2 mb-2 text-[#003D3C]">
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Message</span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap italic text-muted-foreground">
                  {viewRecord.message ? `"${viewRecord.message}"` : "No message provided."}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Follow-Up Request?</DialogTitle>
            <DialogDescription>
              This will permanently remove the follow-up request from <span className="font-bold">{data?.records.find(r => r.id === deleteId)?.name}</span>.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
