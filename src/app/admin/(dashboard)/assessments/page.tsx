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
  User,
  Building2,
  Globe,
  Briefcase,
  ChevronDown,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
              <table className="w-full text-sm border-collapse">
                <thead className="bg-muted/30 border-b border-border/60 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3.5 text-left">Date</th>
                    <th className="px-4 py-3.5 text-left">Organisation</th>
                    <th className="px-4 py-3.5 text-left">Industry</th>
                    <th className="px-4 py-3.5 text-left w-48">Maturity Score</th>
                    <th className="px-4 py-3.5 text-left">Tier</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {data.records.map((r) => (
                    <tr key={r.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-4 py-4 text-muted-foreground whitespace-nowrap">
                        {new Date(r.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-[#003D3C]">{r.companyName || "—"}</div>
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                          <User className="h-3 w-3" />
                          {r.respondentName || "—"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">{r.industry || "—"}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#003D3C] transition-all duration-500" 
                              style={{ width: `${r.overallScore}%` }}
                            />
                          </div>
                          <span className="font-bold text-[#003D3C] w-8 text-right tabular-nums">{r.overallScore}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className={cn("capitalize font-medium px-2 py-0.5 border text-[10px]", TIER_STYLES[r.tier.toLowerCase()]?.color)}>
                          {r.tier}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground group-hover:text-[#003D3C]">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setViewRecord(r)} className="cursor-pointer">
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDownloadPDF(r)} disabled={downloadingId === r.id} className="cursor-pointer">
                              <FileDown className={cn("h-4 w-4 mr-2", downloadingId === r.id && "animate-pulse")} />
                              {downloadingId === r.id ? "Generating..." : "Download PDF"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setDeleteId(r.id)} className="text-destructive cursor-pointer">
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

            <div className="p-4 border-t border-border/60 bg-muted/5 flex items-center justify-between text-xs text-muted-foreground">
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 gap-0">
          {viewRecord && (
            <>
              <DialogHeader className="p-6 border-b bg-muted/20">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={cn("capitalize text-[10px] border", TIER_STYLES[viewRecord.tier.toLowerCase()]?.color)}>
                        {viewRecord.tier} Tier
                      </Badge>
                      <span className="text-xs text-muted-foreground">{formatDate(viewRecord.createdAt)}</span>
                    </div>
                    <DialogTitle className="text-2xl font-bold text-[#003D3C]">
                      {viewRecord.companyName || "Anonymous Organisation"}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                      Internal Audit Maturity Benchmark Details
                    </DialogDescription>
                  </div>
                  <Button 
                    onClick={() => handleDownloadPDF(viewRecord)} 
                    disabled={downloadingId === viewRecord.id} 
                    className="bg-[#003D3C] hover:bg-[#003D3C]/90 rounded-full px-6"
                  >
                    <FileDown className={cn("h-4 w-4 mr-2", downloadingId === viewRecord.id && "animate-pulse")} />
                    {downloadingId === viewRecord.id ? "Generating..." : "Download Report"}
                  </Button>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-8">
                {/* Respondent Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <InfoCard icon={User} label="Respondent" value={viewRecord.respondentName} />
                  <InfoCard icon={Mail} label="Email" value={viewRecord.respondentEmail} />
                  <InfoCard icon={Briefcase} label="Role" value={viewRecord.role} />
                  <InfoCard icon={Building2} label="Company Size" value={viewRecord.companySize} />
                  <InfoCard icon={Globe} label="Country" value={viewRecord.country} />
                  <InfoCard icon={Clock} label="Duration" value={formatDuration(viewRecord.durationSec)} />
                  <InfoCard 
                    icon={CheckCircle2} 
                    label="Consent" 
                    value={viewRecord.consentContact ? "Agreed to contact" : "No contact"} 
                    valueColor={viewRecord.consentContact ? "text-emerald-600" : "text-muted-foreground"}
                  />
                  <InfoCard icon={TrendingUp} label="Follow-ups" value={String(viewRecord.followUps.length)} />
                </div>

                {/* Domain Scores Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-[#003D3C] rounded-full" />
                    <h3 className="font-bold text-[#003D3C] uppercase text-xs tracking-widest">Maturity by Domain</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {DIMENSIONS.map(d => {
                      const score = viewRecord.scores[d.key];
                      const max = DOMAIN_MAX_POINTS[d.key];
                      const percent = Math.round((score / max) * 100);
                      return (
                        <div key={d.key} className="p-4 rounded-xl border bg-muted/5 space-y-3">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider leading-tight h-8 line-clamp-2">
                            {d.label}
                          </p>
                          <div className="flex items-baseline justify-between">
                            <span className="text-2xl font-bold text-[#003D3C] tabular-nums">{score}</span>
                            <span className="text-[10px] text-muted-foreground">/ {max}</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-medium">
                              <span>Maturity</span>
                              <span>{percent}%</span>
                            </div>
                            <Progress value={percent} className="h-1 bg-muted" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Question Breakdown Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-1 bg-[#003D3C] rounded-full" />
                    <h3 className="font-bold text-[#003D3C] uppercase text-xs tracking-widest">Question Responses</h3>
                  </div>
                  
                  <Accordion type="multiple" className="border rounded-xl overflow-hidden bg-card">
                    {DIMENSIONS.map((dim, dimIdx) => {
                      const dimQuestions = BENCHMARK_QUESTIONS.filter(q => q.dimension === dim.key);
                      return (
                        <AccordionItem key={dim.key} value={dim.key} className={cn("border-b", dimIdx === DIMENSIONS.length - 1 && "border-0")}>
                          <AccordionTrigger className="px-6 hover:bg-muted/30 hover:no-underline py-4">
                            <div className="flex items-center gap-3">
                              <div className="size-6 rounded-full bg-[#003D3C]/10 flex items-center justify-center text-[#003D3C] text-[10px] font-bold">
                                {dimIdx + 1}
                              </div>
                              <span className="text-sm font-semibold text-[#003D3C]">{dim.label}</span>
                              <Badge variant="secondary" className="ml-2 text-[10px] px-2 py-0">
                                {dimQuestions.length} Questions
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4 pt-2 space-y-4">
                            {dimQuestions.map((q, qIdx) => {
                              const resp = viewRecord.responses?.[q.id];
                              const questionIndex = BENCHMARK_QUESTIONS.findIndex(bq => bq.id === q.id) + 1;
                              return (
                                <div key={q.id} className="p-4 rounded-lg bg-muted/20 border border-border/40 space-y-2">
                                  <div className="flex gap-3">
                                    <span className="text-xs font-bold text-muted-foreground tabular-nums pt-0.5">{questionIndex}.</span>
                                    <p className="text-sm font-medium leading-relaxed">{q.prompt}</p>
                                  </div>
                                  <div className="ml-7 flex flex-wrap items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border shadow-sm">
                                      <span className="text-[10px] font-bold text-[#003D3C] uppercase tracking-tighter border-r pr-2 mr-1">Selection</span>
                                      <span className="text-sm font-semibold">{resp?.option || "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border shadow-sm">
                                      <span className="text-[10px] font-bold text-[#003D3C] uppercase tracking-tighter border-r pr-2 mr-1">Points</span>
                                      <span className="text-sm font-bold tabular-nums">{resp?.score ?? 0}</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </div>
              </div>
            </>
          )}
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

function InfoCard({ 
  icon: Icon, 
  label, 
  value, 
  valueColor = "text-foreground" 
}: { 
  icon: React.ComponentType<{ className?: string }>; 
  label: string; 
  value: string | null;
  valueColor?: string;
}) {
  return (
    <div className="p-3 rounded-xl border bg-card shadow-sm flex items-start gap-3">
      <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className={cn("text-sm font-semibold truncate mt-0.5", valueColor)}>{value || "—"}</p>
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
