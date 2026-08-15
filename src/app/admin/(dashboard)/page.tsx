"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FileText,
  Mail,
  Briefcase,
  UserPlus,
  TrendingUp,
  Clock,
  Users,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdminErrorState, AdminLoadingState } from "@/components/admin/admin-loading-state";
import { formatDate, formatDuration } from "@/lib/utils";

interface DashboardStats {
  totalAssessments: number;
  averageScore: number;
  averageDuration: number;
  totalFollowUps: number;
  totalContacts: number;
  totalCareers: number;
  totalNewsletter: number;
  latestAssessments: any[];
  recentContacts: any[];
  recentCareers: any[];
}



export default function AdminDashboardPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [previousStats, setPreviousStats] = React.useState<DashboardStats | null>(null);

  React.useEffect(() => {
    // Only fetch data when session is authenticated
    if (sessionStatus !== "authenticated") return;

    let isMounted = true;
    const controller = new AbortController();

    async function fetchData() {
      setError(null); // Reset error state before fetch
      // Keep previous data visible if available
      if (stats) setPreviousStats(stats);
      setLoading(true);

      try {
        const res = await fetch("/api/admin/dashboard-stats", {
          signal: controller.signal,
        });
        if (!res.ok) {
          throw new Error("Unable to load dashboard data right now");
        }
        const response = await res.json();
        if (isMounted) {
          setStats(response.data);
          setPreviousStats(null);
        }
      } catch (err) {
        if (!isMounted || (err instanceof DOMException && err.name === "AbortError")) {
          return;
        }
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Unable to load dashboard data right now");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [sessionStatus]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    void fetch("/api/admin/dashboard-stats").then(async (res) => {
      if (!res.ok) throw new Error("Unable to load dashboard data right now");
      const response = await res.json();
      setStats(response.data);
    }).catch(() => setError("Unable to load dashboard data right now. Please try refreshing in a moment.")).finally(() => setLoading(false));
  };

  // Always check loading first!
  if (loading) {
    const displayStats = previousStats || stats;
    if (displayStats) {
      return (
        <div className="space-y-6 opacity-80">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
              <span>Refreshing</span>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <span>Loading dashboard</span>
        </div>
        <AdminLoadingState rows={7} itemClassName="h-5 w-20" className="space-y-6" />
      </div>
    );
  }

  if (error) {
    return (
      <AdminErrorState
        title="Unable to load dashboard data"
        description={error}
        onRetry={handleRetry}
      />
    );
  }

  const kpiCards = [
    {
      title: "Total Assessments",
      value: stats?.totalAssessments || 0,
      icon: <FileText className="h-4 w-4" />,
      link: "/admin/assessments",
    },
    {
      title: "Average Score",
      value: `${stats?.averageScore || 0} / 100`,
      icon: <TrendingUp className="h-4 w-4" />,
      link: "/admin/assessments",
    },
    {
      title: "Avg Completion Time",
      value: formatDuration(stats?.averageDuration || 0),
      icon: <Clock className="h-4 w-4" />,
      link: "/admin/assessments",
    },
    {
      title: "Total Follow-Ups",
      value: stats?.totalFollowUps || 0,
      icon: <CheckCircle className="h-4 w-4" />,
      link: "/admin/assessments",
    },
    {
      title: "Contact Inquiries",
      value: stats?.totalContacts || 0,
      icon: <Mail className="h-4 w-4" />,
      link: "/admin/contact",
    },
    {
      title: "Career Applications",
      value: stats?.totalCareers || 0,
      icon: <Briefcase className="h-4 w-4" />,
      link: "/admin/careers",
    },
    {
      title: "Newsletter Subscribers",
      value: stats?.totalNewsletter || 0,
      icon: <UserPlus className="h-4 w-4" />,
      link: "/admin/newsletter",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {kpiCards.map((card, i) => (
          <Link key={i} href={card.link} className="group">
            <Card className="rounded-lg shadow-sm border-border/60 transition-all transform hover:scale-[1.01] hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <span className="text-[#0b6f61]">{card.icon}</span>
                  <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    {card.title}
                  </span>
                </div>
                <p className="text-2xl font-semibold tracking-tight">
                  {card.value}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
        <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button asChild variant="secondary" className="justify-start transition-transform hover:scale-105">
            <Link href="/admin/assessments">View Assessments</Link>
          </Button>
          <Button asChild variant="secondary" className="justify-start transition-transform hover:scale-105">
            <Link href="/admin/contact">View Contacts</Link>
          </Button>
          <Button asChild variant="secondary" className="justify-start transition-transform hover:scale-105">
            <Link href="/admin/careers">View Applications</Link>
          </Button>
          <Button asChild variant="secondary" className="justify-start transition-transform hover:scale-105">
            <Link href="/admin/newsletter">View Subscribers</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Latest Assessments */}
        <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Latest Assessments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.latestAssessments.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>No assessments yet.</span>
              </div>
            ) : (
              stats?.latestAssessments.map((assessment) => (
                <Link
                  key={assessment.id}
                  href="/admin/assessments"
                  className="block"
                >
                  <div className="flex items-start justify-between p-3 rounded-lg border border-border/60 hover:bg-secondary/50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {assessment.companyName ||
                          assessment.respondentName ||
                          "Anonymous"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {assessment.respondentEmail}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(assessment.createdAt)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="px-2 py-0.5">{assessment.tier}</Badge>
                      <p className="text-sm font-semibold mt-1">
                        {Math.round(assessment.overallScore)} / 100
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Contacts */}
        <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Recent Contacts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.recentContacts.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>No contact inquiries yet.</span>
              </div>
            ) : (
              stats?.recentContacts.map((contact) => (
                <Link
                  key={contact.id}
                  href="/admin/contact"
                  className="block"
                >
                  <div className="flex items-start justify-between p-3 rounded-lg border border-border/60 hover:bg-secondary/50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {contact.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {contact.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(contact.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="px-2 py-0.5">{contact.topic}</Badge>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Recent Applications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats?.recentCareers.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>No career applications yet.</span>
              </div>
            ) : (
              stats?.recentCareers.map((app) => (
                <Link
                  key={app.id}
                  href="/admin/careers"
                  className="block"
                >
                  <div className="flex items-start justify-between p-3 rounded-lg border border-border/60 hover:bg-secondary/50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {app.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {app.roleTitle}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDate(app.createdAt)}
                      </p>
                    </div>
                    <Badge variant="outline" className="px-2 py-0.5">{app.status}</Badge>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
