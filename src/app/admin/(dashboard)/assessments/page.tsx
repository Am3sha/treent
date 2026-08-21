"use client";

import * as React from "react";
import {
  Download,
  Filter,
  RefreshCw,
  FileText,
  MoreVertical,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Trash2,
  FileDown,
  X,
  Database,
  TrendingUp,
  CheckCircle2,
  Clock,
  Mail,
} from "lucide-react";
import { DOMAIN_MAX_POINTS } from "@/lib/benchmark-scoring";
import { generatePDF } from "@/lib/pdf-generator";
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
import { DIMENSIONS, BENCHMARK_QUESTIONS } from "@/lib/content";
import type { Dimension, MaturityTier } from "@/lib/types";
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
import { formatDate, formatDuration, csvEscape, downloadCsv, cn } from "@/lib/utils";

interface AdminRecord {
  id: string;
  respondentName: string | null;
  respondentEmail: string | null;
  companyName: string | null;
  companySize: string | null;
  industry: string | null;
  country: string | null;
  role: string | null;
  consentContact: boolean;
  overallScore: number;
  scores: Record<Dimension, number>;
  tier: MaturityTier;
  questionCount: number;
  durationSec: number | null;
  createdAt: string;
  responses: Record<string, { option: string; score: number }> | null;
  followUps: {
    id: string;
    interest: string;
    status: string;
    createdAt: string;
  }[];
}

interface AdminResponse {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  records: AdminRecord[];
  filters: {
    industries: string[];
    companySizes: string[];
    tiers: string[];
  };
}

const TIER_STYLES: Record<string, { label: string; color: string }> = {
  initial: { label: "Initial", color: "bg-red-500/10 text-red-700 border-red-500/20" },
  developing: { label: "Developing", color: "bg-orange-500/10 text-orange-700 border-orange-500/20" },
  defined: { label: "Defined", color: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20" },
  established: { label: "Established", color: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20" },
  advanced: { label: "Advanced", color: "bg-teal-600/10 text-teal-700 border-teal-600/20" },
};

export default function AdminAssessmentsPage() {
  const [data, setData] = React.useState<AdminResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [tier, setTier] = React.useState<string>("all");
  const [industry, setIndustry] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [viewRecord, setViewRecord] = React.useState<AdminRecord | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [downloadingId, setDownloadingId] = React.useState<string | null>(null);
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
        if (tier !== "all") params.set("tier", tier);
        if (industry !== "all") params.set("industry", industry);
        
        const res = await fetch(`/api/admin/assessments?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("fetch failed");
        const json = (await res.json()) as { ok: boolean; data: AdminResponse };
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
  }, [page, tier, industry, debouncedSearch, refreshKey]);

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((v) => v + 1);
  };

  const handleDownloadPDF = async (record: AdminRecord) => {
    setDownloadingId(record.id);
    try {
      const result = {
        id: record.id,
        overall: record.overallScore,
        scores: record.scores,
        tier: record.tier,
        percentile: 0,
        questionCount: record.questionCount,
        createdAt: record.createdAt,
        responses: record.responses || {},
      };
      const respondent = {
        name: record.respondentName || "",
        email: record.respondentEmail || "",
        company: record.companyName || "",
        companySize: record.companySize || "",
        industry: record.industry || "",
        country: record.country || "",
        role: record.role || "",
        consentContact: record.consentContact,
      };
      await generatePDF(result, respondent, null);
    } catch (err) {
      toast({ title: "Error", description: "Failed to generate PDF", variant: "destructive" });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/assessments?id=${encodeURIComponent(deleteId)}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete assessment");
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          total: prev.total - 1,
          records: prev.records.filter((r) => r.id !== deleteId),
        };
      });
      toast({ title: "Assessment Deleted", description: "The assessment has been successfully deleted." });
      setDeleteId(null);
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "An error occurred", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCsv = () => {
    if (!data) return;
    const headers = ["ID", "Submitted", "Company", "Industry", "Score", "Tier"];
    const rows = data.records.map((r) => [
      r.id, formatDate(r.createdAt), r.companyName || "—", r.industry || "—", r.overallScore, r.tier
    ]);
    const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
    downloadCsv(csv, `trennt-assessments-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const stats = React.useMemo(() => {
    if (!data) return null;
    const avgOverall = data.records.length > 0 ? Math.round(data.records.reduce((sum, r) => sum + r.overallScore, 0) / data.records.length) : 0;
    return { total: data.total, avgOverall };
  }, [data]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003D3C]">Assessments</h1>
          <p className="text-sm text-muted-foreground">Manage and review all internal audit capability benchmarks.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCsv} disabled={!data || data.records.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#003D3C]/10 flex items-center justify-center text-[#003D3C]">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Assessments</p>
            <p className="text-2xl font-bold text-[#003D3C]">{stats?.total ?? "—"}</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-[#ADDFB3]/20 flex items-center justify-center text-[#003D3C]">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Average Score</p>
            <p className="text-2xl font-bold text-[#003D3C]">{stats?.avgOverall ?? "—"}%</p>
          </div>
        </Card>
        {/* Placeholder for more KPIs if needed */}
      </div>

      {/* Table Section */}
      <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-border/60 bg-muted/20 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by company or industry..."
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
            <Select value={tier} onValueChange={(v) => { setPage(1); setTier(v); }}>
              <SelectTrigger className="h-10 w-[140px]">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue placeholder="Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                {data?.filters.tiers.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={industry} onValueChange={(v) => { setPage(1); setIndustry(v); }}>
              <SelectTrigger className="h-10 w-[180px]">
                <SelectValue placeholder="Industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {data?.filters.industries.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
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
            <p className="text-destructive">Failed to load assessments. Please try again.</p>
            <Button variant="link" onClick={handleRefresh}>Retry</Button>
          </div>
        ) : !data || data.records.length === 0 ? (
          <div className="p-20 text-center text-muted-foreground">
            <Database className="h-10 w-10 mx-auto mb-4 opacity-20" />
            <p>No assessments found matching your criteria.</p>
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
                    <th className="px-4 py-3.5 w-48">Score</th>
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
                        <div className="font-medium text-[#003D3C]">{r.companyName || "—"}</div>
                        <div className="text-xs text-muted-foreground">{r.respondentName || "—"}</div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{r.industry || "—"}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <Progress value={r.overallScore} className="h-1.5 flex-1 bg-muted" />
                          <span className="font-bold text-[#003D3C] w-8 text-right">{r.overallScore}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={cn("capitalize font-medium px-2 py-0.5 border", TIER_STYLES[r.tier.toLowerCase()]?.color)}>
                          {r.tier}
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
                            <DropdownMenuItem onClick={() => handleDownloadPDF(r)} disabled={downloadingId === r.id}>
                              <FileDown className={cn("h-4 w-4 mr-2", downloadingId === r.id && "animate-pulse")} />
                              {downloadingId === r.id ? "Exporting..." : "Export PDF"}
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#003D3C]">Assessment Details</DialogTitle>
            <DialogDescription>Full breakdown for {viewRecord?.companyName || "Anonymous Organisation"}</DialogDescription>
          </DialogHeader>
          {viewRecord && <RecordDetail record={viewRecord} onDownload={() => handleDownloadPDF(viewRecord)} downloading={downloadingId === viewRecord.id} />}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Assessment?</DialogTitle>
            <DialogDescription>
              This will permanently remove the assessment for <span className="font-bold">{data?.records.find(r => r.id === deleteId)?.companyName || "this organisation"}</span>.
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

function RecordDetail({ record, onDownload, downloading }: { record: AdminRecord; onDownload: () => void; downloading: boolean }) {
  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-end">
        <Button onClick={onDownload} disabled={downloading} variant="outline" size="sm">
          <FileDown className={cn("h-4 w-4 mr-2", downloading && "animate-pulse")} />
          Download PDF Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DetailItem label="Respondent" value={record.respondentName || "—"} />
        <DetailItem label="Email" value={record.respondentEmail || "—"} />
        <DetailItem label="Role" value={record.role || "—"} />
        <DetailItem label="Country" value={record.country || "—"} />
        <DetailItem label="Company Size" value={record.companySize || "—"} />
        <DetailItem label="Duration" value={formatDuration(record.durationSec)} />
        <DetailItem label="Consent" value={record.consentContact ? "Yes" : "No"} />
        <DetailItem label="Follow-ups" value={String(record.followUps.length)} />
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-[#003D3C] border-b pb-2">Domain Scores</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DIMENSIONS.map(d => (
            <div key={d.key} className="p-3 rounded-lg border bg-muted/10">
              <p className="text-xs text-muted-foreground uppercase mb-1">{d.label}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[#003D3C]">{record.scores[d.key]}</span>
                <span className="text-xs text-muted-foreground">/ {DOMAIN_MAX_POINTS[d.key]}</span>
              </div>
              <Progress value={(record.scores[d.key] / DOMAIN_MAX_POINTS[d.key]) * 100} className="h-1 mt-2" />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-[#003D3C] border-b pb-2">Question Responses</h3>
        <div className="space-y-4">
          {BENCHMARK_QUESTIONS.map((q, idx) => {
            const resp = record.responses?.[q.id];
            return (
              <div key={q.id} className="text-sm">
                <p className="font-medium mb-1">{idx + 1}. {q.prompt}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="font-normal">{resp?.option || "—"}</Badge>
                  <span className="text-xs text-muted-foreground">Score: {resp?.score ?? 0}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-card text-card-foreground shadow-sm", className)} {...props}>
      {children}
    </div>
  );
}
