"use client";

import * as React from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from "recharts";
import { TooltipValueType } from "recharts";
import {
    TrendingUp,
    TrendingDown,
    Users,
    Target,
    Clock,
    ShieldCheck,
    Globe,
    AlertCircle,
    ThumbsUp,
    ThumbsDown,
    Calendar,
    Building,
    MapPin,
    Award,
    AlertTriangle,
    Activity,
    Clock3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AdminErrorState, AdminLoadingState } from "@/components/admin/admin-loading-state";
import { formatDuration } from "@/lib/utils";

const COLORS = ["#002147", "#123A63", "#245380", "#366C9D", "#4885B9"];
const TIER_COLORS: Record<string, string> = {
    initial: "#f87171",
    developing: "#f59e0b",
    defined: "#a78bfa",
    established: "#10b981",
    advanced: "#0d9488",
};

interface QuestionStat {
    questionId: string;
    questionText: string;
    dimension: string;
    avgValue: number;
    avgScore: number;
    responseCount: number;
}

interface IndustryBenchmark {
    industry: string;
    count: number;
    avgScore: number;
    avgGovernanceScore: number;
    avgRiskScore: number;
    avgExecutionScore: number;
    avgReportingScore: number;
    avgCapabilityScore: number;
}

interface RecentAssessment {
    id: string;
    companyName: string | null;
    country: string | null;
    industry: string | null;
    overallScore: number;
    tier: string;
    createdAt: string;
}

interface InsightsData {
    totalAssessments: number;
    averageScore: number;
    averageDuration: number;
    completionRate: number;
    scoreDistribution: { range: string; count: number; percentage: number }[];
    tierBreakdown: { tier: string; count: number; percentage: number; avgScore: number }[];
    industryBenchmark: IndustryBenchmark[];
    sizeBenchmark: { size: string; count: number; avgScore: number }[];
    countryBreakdown: { country: string; count: number }[];
    dimensionAverages: Record<string, number>;
    questionHeatmap: QuestionStat[];
    topQuestions: QuestionStat[];
    bottomQuestions: QuestionStat[];
    aiAdoptionScore: number;
    monthlyTrend: { month: string; count: number; avgScore: number }[];
    // New fields
    assessmentsThisWeek: number;
    assessmentsThisMonth: number;
    monthlyGrowth: number;
    topCountries: { country: string; count: number; avgScore: number }[];
    topIndustries: { industry: string; count: number; avgScore: number }[];
    highestPerformingDimension: { name: string; score: number };
    lowestPerformingDimension: { name: string; score: number };
    completionTimeTrend: { month: string; avgDuration: number }[];
    aiAdoptionTrend: { month: string; avgAiScore: number }[];
    recentAssessments: RecentAssessment[];
}

export default function AdminInsightsPage() {
    const [data, setData] = React.useState<InsightsData | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch("/api/admin/insights");
                if (!res.ok) throw new Error("Failed to load insights");
                const response = await res.json();
                setData(response.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                    <span>Loading insights</span>
                </div>
                <AdminLoadingState rows={8} itemClassName="h-5 w-20" className="space-y-6" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <AdminErrorState
                title="Unable to load insights"
                description="We couldn't reach the database right now. Please try again in a moment."
                onRetry={() => window.location.reload()}
            />
        );
    }

    const dimensionData = Object.entries(data.dimensionAverages).map(([key, val]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        score: val,
    }));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold tracking-tight">Executive Analytics Dashboard</h1>
                <p className="text-muted-foreground">Comprehensive analytics across all assessments.</p>
            </div>

            {/* KPI Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                    icon={<Target className="h-4 w-4" />}
                    label="Avg Score"
                    value={`${data.averageScore} / 100`}
                />
                <KpiCard
                    icon={<Clock className="h-4 w-4" />}
                    label="Avg Time"
                    value={formatDuration(data.averageDuration)}
                />
                <KpiCard
                    icon={<ShieldCheck className="h-4 w-4" />}
                    label="Completion Rate"
                    value={`${data.completionRate}%`}
                />
                <KpiCard
                    icon={<TrendingUp className="h-4 w-4" />}
                    label="AI Adoption"
                    value={`${data.aiAdoptionScore}%`}
                />
                <KpiCard
                    icon={<Calendar className="h-4 w-4" />}
                    label="This Week"
                    value={data.assessmentsThisWeek.toString()}
                />
                <KpiCard
                    icon={<Calendar className="h-4 w-4" />}
                    label="This Month"
                    value={data.assessmentsThisMonth.toString()}
                />
                <KpiCard
                    icon={data.monthlyGrowth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    label="Monthly Growth"
                    value={`${data.monthlyGrowth >= 0 ? '+' : ''}${data.monthlyGrowth}%`}
                    trendColor={data.monthlyGrowth >= 0 ? 'text-green-500' : 'text-destructive'}
                />
                <KpiCard
                    icon={<Users className="h-4 w-4" />}
                    label="Total Assessments"
                    value={data.totalAssessments.toString()}
                />
            </div>

            {/* New widgets row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Highest Performing Dimension */}
                <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Award className="h-4 w-4 text-green-500" />
                            Highest Performing Dimension
                        </CardTitle>
                        <CardDescription>Your strongest area of performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-primary mb-1">
                            {data.highestPerformingDimension.name.charAt(0).toUpperCase() + data.highestPerformingDimension.name.slice(1)}
                        </div>
                        <div className="text-lg font-semibold text-muted-foreground">
                            {data.highestPerformingDimension.score} / 100
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            This is your strongest area, continue to invest and maintain momentum.
                        </p>
                    </CardContent>
                </Card>

                {/* Lowest Performing Dimension */}
                <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                            Lowest Performing Dimension
                        </CardTitle>
                        <CardDescription>Area for focus and improvement.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-destructive mb-1">
                            {data.lowestPerformingDimension.name.charAt(0).toUpperCase() + data.lowestPerformingDimension.name.slice(1)}
                        </div>
                        <div className="text-lg font-semibold text-muted-foreground">
                            {data.lowestPerformingDimension.score} / 100
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            This is an opportunity for growth - consider targeted improvements here.
                        </p>
                    </CardContent>
                </Card>

                {/* Average Completion Time Trend */}
                <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Clock3 className="h-4 w-4" />
                            Completion Time Trend
                        </CardTitle>
                        <CardDescription>Average time to complete assessment by month.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-48">
                        {data.completionTimeTrend.length > 1 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.completionTimeTrend}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="month" fontSize={10} />
                                    <YAxis fontSize={10} />
                                    <Tooltip formatter={(value: TooltipValueType | undefined) => formatDuration(typeof value === "number" ? value : 0)} />
                                    <Line type="monotone" dataKey="avgDuration" stroke="#002147" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                                Insufficient data for trend
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Existing charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dimension Averages */}
                <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Dimension Averages</CardTitle>
                        <CardDescription>Average performance across all 5 key dimensions.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dimensionData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Bar dataKey="score" fill="#002147" radius={[0, 4, 4, 0]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Score Distribution */}
                <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Score Distribution</CardTitle>
                        <CardDescription>Percentage of organisations in each score bracket.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.scoreDistribution}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="range" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#123A63" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tier Breakdown */}
                <Card className="rounded-lg shadow-sm border-border/60 lg:col-span-1 transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Maturity Tiers</CardTitle>
                        <CardDescription>Breakdown of organisations by maturity level.</CardDescription>
                    </CardHeader>
                    <CardContent className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.tierBreakdown}
                                    dataKey="count"
                                    nameKey="tier"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {data.tierBreakdown.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={TIER_COLORS[entry.tier] || COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Top/Bottom Questions */}
                <Card className="rounded-lg shadow-sm border-border/60 lg:col-span-2 transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Question Heatmap: Critical Weaknesses & Strengths</CardTitle>
                        <CardDescription>The questions where organisations score lowest (gaps) and highest (strengths).</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-destructive">
                                    <ThumbsDown className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Top 5 Weaknesses</span>
                                </div>
                                <div className="grid gap-2">
                                    {data.bottomQuestions.map((q, i) => (
                                        <QuestionRow key={i} question={q} color="text-destructive" />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-3 text-primary">
                                    <ThumbsUp className="h-4 w-4" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Top 5 Strengths</span>
                                </div>
                                <div className="grid gap-2">
                                    {data.topQuestions.map((q, i) => (
                                        <QuestionRow key={i} question={q} color="text-primary" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Countries */}
                <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Top Countries
                        </CardTitle>
                        <CardDescription>Top 5 countries by assessment count.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-border/60 text-left">
                                        <th className="py-2 font-medium">Country</th>
                                        <th className="py-2 text-center font-medium">Count</th>
                                        <th className="py-2 text-right font-medium">Avg Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {data.topCountries.map((row, i) => (
                                        <tr key={i} className="hover:bg-secondary/20">
                                            <td className="py-2 font-medium">{row.country}</td>
                                            <td className="py-2 text-center">{row.count}</td>
                                            <td className={`py-2 text-right font-semibold ${row.avgScore < 40 ? 'text-destructive' : row.avgScore > 60 ? 'text-primary' : 'text-amber-600'}`}>
                                                {row.avgScore}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Top Industries */}
                <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Top Industries
                        </CardTitle>
                        <CardDescription>Top 5 industries by assessment count.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-border/60 text-left">
                                        <th className="py-2 font-medium">Industry</th>
                                        <th className="py-2 text-center font-medium">Count</th>
                                        <th className="py-2 text-right font-medium">Avg Score</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {data.topIndustries.map((row, i) => (
                                        <tr key={i} className="hover:bg-secondary/20">
                                            <td className="py-2 font-medium">{row.industry}</td>
                                            <td className="py-2 text-center">{row.count}</td>
                                            <td className={`py-2 text-right font-semibold ${row.avgScore < 40 ? 'text-destructive' : row.avgScore > 60 ? 'text-primary' : 'text-amber-600'}`}>
                                                {row.avgScore}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Industry Benchmarks */}
                <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                    <CardHeader>
                        <CardTitle className="text-base font-medium">Industry Benchmarks</CardTitle>
                        <CardDescription>Average scores and participation by industry.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-b border-border/60 text-left">
                                        <th className="py-2 font-medium">Industry</th>
                                        <th className="py-2 text-center font-medium">Count</th>
                                        <th className="py-2 text-right font-medium">Avg Score</th>
                                        <th className="py-2 text-right font-medium">Gov</th>
                                        <th className="py-2 text-right font-medium">Risk</th>
                                        <th className="py-2 text-right font-medium">Exec</th>
                                        <th className="py-2 text-right font-medium">Rep</th>
                                        <th className="py-2 text-right font-medium">Cap</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    {data.industryBenchmark.map((row, i) => (
                                        <tr key={i} className="hover:bg-secondary/20">
                                            <td className="py-2 font-medium">{row.industry}</td>
                                            <td className="py-2 text-center">{row.count}</td>
                                            <td className={`py-2 text-right font-semibold ${row.avgScore < 40 ? 'text-destructive' : row.avgScore > 60 ? 'text-primary' : 'text-amber-600'}`}>
                                                {row.avgScore}
                                            </td>
                                            <td className="py-2 text-right text-muted-foreground">{row.avgGovernanceScore}</td>
                                            <td className="py-2 text-right text-muted-foreground">{row.avgRiskScore}</td>
                                            <td className="py-2 text-right text-muted-foreground">{row.avgExecutionScore}</td>
                                            <td className="py-2 text-right text-muted-foreground">{row.avgReportingScore}</td>
                                            <td className="py-2 text-right text-muted-foreground">{row.avgCapabilityScore}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* Regional Reach and AI Adoption Trend */}
                <div className="space-y-6">
                    <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">Regional Reach</CardTitle>
                            <CardDescription>Assessment participation by country.</CardDescription>
                        </CardHeader>
                        <CardContent className="h-48">
                            <div className="flex flex-wrap gap-2">
                                {data.countryBreakdown.map((c, i) => (
                                    <Badge key={i} variant="outline" className="gap-1.5 px-3 py-1.5 border-border/60">
                                        <Globe className="h-3.5 w-3.5" />
                                        {c.country}
                                        <span className="ml-1 font-mono font-bold text-primary">{c.count}</span>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {data.aiAdoptionTrend.length > 1 && (
                        <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-base font-medium">AI Adoption Trend</CardTitle>
                                <CardDescription>How AI adoption has evolved over time.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.aiAdoptionTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" fontSize={10} />
                                        <YAxis fontSize={10} domain={[0, 100]} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="avgAiScore" stroke="#002147" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}

                    {data.monthlyTrend.length > 1 && (
                        <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                            <CardHeader>
                                <CardTitle className="text-base font-medium">Monthly Trend</CardTitle>
                                <CardDescription>How the benchmark is growing over time.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.monthlyTrend}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" fontSize={10} />
                                        <YAxis fontSize={10} />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="count" stroke="#0d9488" strokeWidth={2} />
                                        <Line type="monotone" dataKey="avgScore" stroke="#002147" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
                <CardHeader>
                    <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>Latest 10 assessments submitted.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-border/60 text-left">
                                    <th className="py-2 font-medium">Company</th>
                                    <th className="py-2 font-medium">Country</th>
                                    <th className="py-2 font-medium">Industry</th>
                                    <th className="py-2 text-right font-medium">Score</th>
                                    <th className="py-2 font-medium">Tier</th>
                                    <th className="py-2 text-right font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/40">
                                {data.recentAssessments.map((row) => (
                                    <tr key={row.id} className="hover:bg-secondary/20">
                                        <td className="py-2 font-medium">{row.companyName || 'Anonymous'}</td>
                                        <td className="py-2">{row.country || 'N/A'}</td>
                                        <td className="py-2">{row.industry || 'N/A'}</td>
                                        <td className={`py-2 text-right font-semibold ${row.overallScore < 40 ? 'text-destructive' : row.overallScore > 60 ? 'text-primary' : 'text-amber-600'}`}>
                                            {Math.round(row.overallScore)}
                                        </td>
                                        <td className="py-2">
                                            <Badge 
                                                variant="outline" 
                                                style={{ 
                                                    color: TIER_COLORS[row.tier], 
                                                    borderColor: TIER_COLORS[row.tier],
                                                    backgroundColor: `${TIER_COLORS[row.tier]}10`
                                                }}
                                            >
                                                {row.tier}
                                            </Badge>
                                        </td>
                                        <td className="py-2 text-right text-muted-foreground">
                                            {new Date(row.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function KpiCard({ icon, label, value, trendColor }: { icon: React.ReactNode; label: string; value: string; trendColor?: string }) {
    return (
        <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
            <CardContent className="p-5">
                <div className="flex items-center gap-2 text-primary mb-2">
                    {icon}
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
                </div>
                <p className={`text-2xl font-semibold tracking-tight ${trendColor || ''}`}>{value}</p>
            </CardContent>
        </Card>
    );
}

function QuestionRow({ question, color }: { question: QuestionStat; color: string }) {
    return (
        <div className="flex items-center justify-between p-2 rounded-md border border-border/40 bg-secondary/10 text-xs">
            <div className="min-w-0 flex-1 mr-4">
                <p className="truncate font-medium">{question.questionText}</p>
                <p className="text-[10px] text-muted-foreground uppercase opacity-70">{question.dimension}</p>
            </div>
            <div className="text-right shrink-0">
                <span className={`font-bold ${color}`}>{question.avgScore}</span>
                <span className="text-[10px] text-muted-foreground ml-1">avg</span>
            </div>
        </div>
    );
}
