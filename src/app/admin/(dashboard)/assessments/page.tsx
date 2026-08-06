"use client";

import * as React from "react";
import {
  Download,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  Filter,
  Users,
  TrendingUp,
  Clock,
  Database,
  RefreshCw,
  Mail,
  Building2,
  CheckCircle2,
  FileText,
  Trash2,
} from "lucide-react";
import { generatePDF } from "@/lib/pdf-generator";
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
import { useToast } from "@/hooks/use-toast";
import { DIMENSIONS, BENCHMARK_QUESTIONS } from "@/lib/content";
import type { Dimension, MaturityTier } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate, formatDuration, csvEscape, downloadCsv } from "@/lib/utils";

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
  responses: Record<string, number> | null;
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

const TIER_COLORS: Record<string, string> = {
  Nascent: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  Developing: "bg-amber-500/10 text-amber-700 border-amber-500/20",
  Established: "bg-emerald-500/10 text-emerald-700 border-emerald-500/20",
  Leading: "bg-teal-500/10 text-teal-700 border-teal-500/20",
};

export default function AdminAssessmentsPage() {
  const [data, setData] = React.useState<AdminResponse | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [tier, setTier] = React.useState<string>("all");
  const [industry, setIndustry] = React.useState<string>("all");
  const [companySize, setCompanySize] = React.useState<string>("all");
  const [page, setPage] = React.useState(1);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [refreshKey, setRefreshKey] = React.useState(0);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const controller = new AbortController();
    let active = true;

    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("pageSize", "20");
        if (tier !== "all") params.set("tier", tier);
        if (industry !== "all") params.set("industry", industry);
        if (companySize !== "all") params.set("companySize", companySize);
        const res = await fetch(`/api/admin/assessments?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("fetch failed");
        const json = (await res.json()) as AdminResponse;
        if (!active) return;
        setData(json);
        setError(false);
      } catch (error) {
        if (
          !active ||
          (error instanceof DOMException && error.name === "AbortError")
        ) {
          return;
        }
        setError(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      active = false;
      controller.abort();
    };
  }, [page, tier, industry, companySize, refreshKey]);

  const beginFetchTransition = React.useCallback(() => {
    setLoading(true);
    setError(false);
  }, []);

  const handleRefresh = React.useCallback(() => {
    beginFetchTransition();
    setRefreshKey((value) => value + 1);
  }, [beginFetchTransition]);

  const handleTierChange = React.useCallback(
    (value: string) => {
      beginFetchTransition();
      setPage(1);
      setTier(value);
    },
    [beginFetchTransition]
  );

  const handleIndustryChange = React.useCallback(
    (value: string) => {
      beginFetchTransition();
      setPage(1);
      setIndustry(value);
    },
    [beginFetchTransition]
  );

  const handleCompanySizeChange = React.useCallback(
    (value: string) => {
      beginFetchTransition();
      setPage(1);
      setCompanySize(value);
    },
    [beginFetchTransition]
  );

  const handleClearFilters = React.useCallback(() => {
    beginFetchTransition();
    setPage(1);
    setTier("all");
    setIndustry("all");
    setCompanySize("all");
  }, [beginFetchTransition]);

  const handleExportCsv = () => {
    if (!data) return;
    const headers = [
      "ID",
      "Submitted",
      "Name",
      "Email",
      "Company",
      "Industry",
      "Company Size",
      "Country",
      "Role",
      "Overall Score",
      "Tier",
      "Strategy",
      "Technology",
      "Culture",
      "Data",
      "Operations",
      "Question Count",
      "Duration (sec)",
      "Consent Contact",
      "Follow-ups",
    ];
    const rows = data.records.map((r) => [
      r.id,
      formatDate(r.createdAt),
      r.respondentName,
      r.respondentEmail,
      r.companyName,
      r.industry,
      r.companySize,
      r.country,
      r.role,
      r.overallScore,
      r.tier,
      r.scores.strategy,
      r.scores.technology,
      r.scores.culture,
      r.scores.data,
      r.scores.operations,
      r.questionCount,
      r.durationSec,
      r.consentContact ? "yes" : "no",
      r.followUps.length,
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");
    downloadCsv(csv, `trennt-assessments-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleExportResponsesCsv = () => {
    if (!data) return;
    const headers = [
      "Assessment ID",
      "Submitted",
      "Company",
      "Industry",
      "Overall Score",
      "Tier",
      "Question ID",
      "Dimension",
      "Question",
      "Response Value (1-5)",
    ];
    const rows: (string | number)[][] = [];
    for (const r of data.records) {
      for (const q of BENCHMARK_QUESTIONS) {
        const value = r.responses?.[q.id];
        if (value === undefined) continue;
        rows.push([
          r.id,
          formatDate(r.createdAt),
          r.companyName ?? "",
          r.industry ?? "",
          r.overallScore,
          r.tier,
          q.id,
          q.dimension,
          q.prompt,
          value,
        ]);
      }
    }
    const csv = [headers, ...rows]
      .map((row) => row.map(csvEscape).join(","))
      .join("\n");
    downloadCsv(csv, `trennt-responses-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/assessments?id=${encodeURIComponent(deleteId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete assessment");
      }

      // Optimistic update: remove from state
      setData((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          total: prev.total - 1,
          records: prev.records.filter((r) => r.id !== deleteId),
        };
      });

      toast({
        title: "Assessment Deleted",
        description: "The assessment has been successfully deleted.",
      });
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred while deleting the assessment.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  // Aggregate stats from current dataset
  const stats = React.useMemo(() => {
    if (!data) return null;
    const records = data.records;
    const avgOverall =
      records.length > 0
        ? Math.round(
            records.reduce((sum, r) => sum + r.overallScore, 0) /
              records.length
          )
        : 0;
    const leadingCount = records.filter((r) => r.tier === "Leading").length;
    const avgDuration =
      records.length > 0
        ? Math.round(
            records.reduce((sum, r) => sum + (r.durationSec ?? 0), 0) /
              records.length
          )
        : 0;
    const withFollowUp = records.filter((r) => r.followUps.length > 0).length;
    return {
      total: data.total,
      avgOverall,
      leadingCount,
      leadingPct: records.length > 0 ? Math.round((leadingCount / records.length) * 100) : 0,
      avgDuration,
      withFollowUp,
    };
  }, [data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assessments</h1>
        <p className="text-muted-foreground">View and manage all benchmark assessments.</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {stats ? (
          <>
            <KpiCard
              icon={<Database className="h-4 w-4" />}
              label="Total records"
              value={String(stats.total)}
            />
            <KpiCard
              icon={<TrendingUp className="h-4 w-4" />}
              label="Avg score"
              value={`${stats.avgOverall} / 100`}
              accent
            />
            <KpiCard
              icon={<CheckCircle2 className="h-4 w-4" />}
              label="Leading tier"
              value={`${stats.leadingPct}%`}
              sub={`${stats.leadingCount} orgs`}
            />
            <KpiCard
              icon={<Clock className="h-4 w-4" />}
              label="Avg duration"
              value={formatDuration(stats.avgDuration)}
            />
            <KpiCard
              icon={<Mail className="h-4 w-4" />}
              label="Follow-ups"
              value={String(stats.withFollowUp)}
              sub="requested"
            />
          </>
        ) : (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        )}
      </div>

      {/* Filters + export */}
      <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-secondary/30 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            <Filter className="h-3.5 w-3.5" />
            Filters
          </span>
          <Select value={tier} onValueChange={handleTierChange}>
            <SelectTrigger className="h-9 w-[150px] text-sm">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All tiers</SelectItem>
              {(data?.filters.tiers ?? []).map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={industry} onValueChange={handleIndustryChange}>
            <SelectTrigger className="h-9 w-[180px] text-sm">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All industries</SelectItem>
              {(data?.filters.industries ?? []).map((i) => (
                <SelectItem key={i} value={i}>
                  {i}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={companySize} onValueChange={handleCompanySizeChange}>
            <SelectTrigger className="h-9 w-[150px] text-sm">
              <SelectValue placeholder="Company size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All sizes</SelectItem>
              {(data?.filters.companySizes ?? []).map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(tier !== "all" || industry !== "all" || companySize !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="h-9 text-xs"
            >
              Clear
            </Button>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCsv}
            disabled={!data || data.records.length === 0}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export summary
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportResponsesCsv}
            disabled={!data || data.records.length === 0}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export responses
          </Button>
        </div>
      </div>

      {/* Records table */}
      <div className="rounded-xl border border-border/60 overflow-hidden">
        {error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShieldAlert className="h-10 w-10 text-destructive" />
            <h2 className="mt-4 text-lg font-semibold">
              Couldn&apos;t load records
            </h2>
            <Button onClick={handleRefresh} className="mt-4 rounded-full">
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="space-y-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : data && data.records.length > 0 ? (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40">
                  <tr className="border-b border-border/60 text-left">
                    <th className="px-4 py-3 font-medium text-muted-foreground"></th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Organisation</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Industry</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Score</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Tier</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Follow-ups</th>
                    <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.records.map((r) => (
                    <React.Fragment key={r.id}>
                      <tr
                        className="cursor-pointer border-b border-border/50 transition-colors hover:bg-secondary/50"
                        onClick={() =>
                          setExpandedId(expandedId === r.id ? null : r.id)
                        }
                      >
                        <td className="px-4 py-3 text-muted-foreground">
                          {expandedId === r.id ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {formatDate(r.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">
                            {r.companyName || r.respondentName || "Anonymous"}
                          </div>
                          {r.respondentEmail && (
                            <div className="text-xs text-muted-foreground">
                              {r.respondentEmail}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {r.industry || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-foreground tabular-nums">
                            {r.overallScore}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {" "}
                            / 100
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              "border " + (TIER_COLORS[r.tier] ?? "")
                            }
                          >
                            {r.tier}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          {r.followUps.length > 0 ? (
                            <Badge
                              variant="secondary"
                              className="gap-1 text-xs font-normal"
                            >
                              <Mail className="h-3 w-3" />
                              {r.followUps.length}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteId(r.id);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Assessment?</DialogTitle>
                                <DialogDescription>
                                  This action will permanently remove the assessment and all related benchmark data.
                                  This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant="ghost" onClick={() => setDeleteId(null)}>
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
                        </td>
                      </tr>
                      {expandedId === r.id && (
                        <tr className="bg-secondary/20">
                          <td colSpan={8} className="px-4 py-5">
                            <RecordDetail record={r} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="divide-y divide-border/50 md:hidden">
              {data.records.map((r) => (
                <div key={r.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() =>
                        setExpandedId(expandedId === r.id ? null : r.id)
                      }
                      className="flex-1 text-left"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-foreground">
                          {r.companyName || r.respondentName || "Anonymous"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(r.createdAt)} · {r.industry || "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold tabular-nums">
                          {r.overallScore}
                        </span>
                        <Badge
                          variant="outline"
                          className={"border " + (TIER_COLORS[r.tier] ?? "")}
                        >
                          {r.tier}
                        </Badge>
                      </div>
                    </button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(r.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Assessment?</DialogTitle>
                          <DialogDescription>
                            This action will permanently remove the assessment and all related benchmark data.
                            This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="ghost" onClick={() => setDeleteId(null)}>
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
                  {expandedId === r.id && (
                    <div className="mt-4">
                      <RecordDetail record={r} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data.totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/60 px-4 py-3 text-sm">
                <span className="text-muted-foreground">
                  Page {data.page} of {data.totalPages} · {data.total} total records
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      beginFetchTransition();
                      setPage((p) => Math.max(1, p - 1));
                    }}
                    disabled={data.page <= 1}
                    className="h-8"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      beginFetchTransition();
                      setPage((p) => Math.min(data.totalPages, p + 1));
                    }}
                    disabled={data.page >= data.totalPages}
                    className="h-8"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-4 text-sm text-muted-foreground">
              No records match these filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Record detail (expanded)
// ---------------------------------------------------------------------------

function RecordDetail({ record }: { record: AdminRecord }) {
  const [downloading, setDownloading] = React.useState(false);
  const dimScores = DIMENSIONS.map((d) => ({
    meta: d,
    score: record.scores[d.key],
  }));

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Map AdminRecord to the types expected by generatePDF
      const result = {
        id: record.id,
        overall: record.overallScore,
        scores: record.scores,
        tier: record.tier as any,
        percentile: 0, // We don't have percentile stored, use 0
        questionCount: record.questionCount,
        createdAt: record.createdAt,
        responses: record.responses || {},
      };
      const respondent = record.respondentName || record.respondentEmail ? {
        name: record.respondentName || "",
        email: record.respondentEmail || "",
        company: record.companyName || "",
        companySize: record.companySize || "",
        industry: record.industry || "",
        country: record.country || "",
        role: record.role || "",
        consentContact: record.consentContact,
      } : null;

      await generatePDF(result as any, respondent as any, null);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadPDF}
          disabled={downloading}
          className="gap-1.5"
        >
          <FileText className={downloading ? "h-3.5 w-3.5 animate-pulse" : "h-3.5 w-3.5"} />
          {downloading ? "Preparing PDF..." : "Download PDF Report"}
        </Button>
      </div>
      {/* Meta grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <DetailField label="Respondent" value={record.respondentName || "—"} />
        <DetailField label="Role" value={record.role || "—"} />
        <DetailField
          label="Company size"
          value={record.companySize || "—"}
        />
        <DetailField label="Country" value={record.country || "—"} />
      </div>

      {/* Dimension scores */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Dimension scores
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-5">
          {dimScores.map((d) => (
            <div
              key={d.meta.key}
              className="rounded-lg border border-border/60 bg-background p-3"
            >
              <p className="text-xs text-muted-foreground">{d.meta.short}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
                {d.score}
                <span className="text-xs font-normal text-muted-foreground">
                  {" "}
                  / 100
                </span>
              </p>
              <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/60"
                  style={{ width: `${d.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Consent + duration */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          Duration: {formatDuration(record.durationSec)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Consent to contact: {record.consentContact ? "Yes" : "No"}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="h-3.5 w-3.5" />
          ID: {record.id.slice(0, 12)}…
        </span>
      </div>

      {/* Individual responses */}
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Individual responses ({Object.keys(record.responses || {}).length})
        </p>
        <div className="mt-2 space-y-1.5">
          {BENCHMARK_QUESTIONS.map((q) => {
            const value = record.responses?.[q.id];
            if (value === undefined) return null;
            return (
              <div
                key={q.id}
                className="flex items-start gap-3 rounded-md border border-border/40 bg-background px-3 py-2"
              >
                <Badge
                  variant="outline"
                  className="shrink-0 border-border/60 text-[10px] font-mono"
                >
                  {q.id}
                </Badge>
                <p className="min-w-0 flex-1 text-xs leading-relaxed text-foreground/80">
                  {q.prompt}
                </p>
                <span className="shrink-0 text-sm font-semibold tabular-nums text-primary">
                  {value} / 5
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Follow-ups */}
      {record.followUps.length > 0 && (
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Follow-up requests ({record.followUps.length})
          </p>
          <div className="mt-2 space-y-1.5">
            {record.followUps.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-3 rounded-md border border-border/40 bg-background px-3 py-2 text-xs"
              >
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span className="font-medium capitalize">{f.interest}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  Status: {f.status}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">
                  {formatDate(f.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <Card
      className={`rounded-xl border-border/60 p-4 transition-all hover:border-primary/30 hover:shadow-sm ${
        accent ? "bg-primary/5" : ""
      }`}
    >
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span
          className={`text-2xl font-semibold tracking-tight tabular-nums ${
            accent ? "text-primary" : "text-foreground"
          }`}
        >
          {value}
        </span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </Card>
  );
}
