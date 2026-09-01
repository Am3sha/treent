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
import { Briefcase, User, Mail, Calendar, Linkedin, FileText, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface CareerApplication {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  roleSlug: string;
  roleTitle: string;
  yearsExp: number | null;
  linkedin: string | null;
  portfolio: string | null;
  message: string | null;
  resume: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}



export default function AdminCareersPage() {
  const [applications, setApplications] = React.useState<CareerApplication[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/careers");
        if (!res.ok) {
          throw new Error("Failed to load applications");
        }
        const response = await res.json();
        setApplications(response.data);
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
      const res = await fetch(`/api/admin/careers?id=${encodeURIComponent(deleteId)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete career application");
      }
      // Optimistic update
      setApplications((prev) => prev.filter((a) => a.id !== deleteId));
      toast({
        title: "Career application deleted",
        description: "The career application has been deleted successfully.",
      });
      setDeleteId(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred while deleting the career application.",
        variant: "destructive",
      });
    } finally {
      setDeleting(false);
    }
  };

  if (error) {
    return (
      <AdminErrorState
        title="Unable to load career applications"
        description="We couldn't reach the database right now. Please try again in a moment."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Career Applications</h1>
        <p className="text-muted-foreground">View and manage all job applications.</p>
      </div>

      {loading ? (
        <AdminLoadingState rows={5} itemClassName="h-4 w-24" />
      ) : applications.length === 0 ? (
        <Card className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Briefcase className="h-10 w-10 text-muted-foreground/40 mb-4" />
            <p className="text-sm text-muted-foreground">No career applications yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app.id} className="rounded-lg shadow-sm border-border/60 transition-all hover:shadow-md">
              <CardHeader
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{app.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-muted-foreground">{app.roleTitle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{app.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(app.createdAt)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-2 py-0.5">{app.status}</Badge>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(app.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete this career application?</DialogTitle>
                          <DialogDescription>
                            This action cannot be undone. This will permanently delete the career application.
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
              {expandedId === app.id && (
                <CardContent className="space-y-4">
                  {app.phone && (
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm">{app.phone}</p>
                    </div>
                  )}
                  {app.yearsExp !== null && (
                    <div>
                      <p className="text-xs text-muted-foreground">Years of Experience</p>
                      <p className="text-sm">{app.yearsExp} years</p>
                    </div>
                  )}
                  {app.resume && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 font-medium">CV / Resume Attachment</p>
                      <a
                        href={app.resume}
                        download={`CV_${app.name.replace(/\s+/g, "_")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3.5 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/20 hover:shadow-xs"
                      >
                        <FileText className="h-4 w-4" />
                        <span>Download / View CV</span>
                      </a>
                    </div>
                  )}
                  {app.linkedin && (
                    <div>
                      <p className="text-xs text-muted-foreground">LinkedIn</p>
                      <a
                        href={app.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Linkedin className="h-3.5 w-3.5" />
                        {app.linkedin}
                      </a>
                    </div>
                  )}
                  {app.portfolio && (
                    <div>
                      <p className="text-xs text-muted-foreground">Portfolio</p>
                      <a
                        href={app.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        {app.portfolio}
                      </a>
                    </div>
                  )}
                  {app.message && (
                    <div>
                      <p className="text-xs text-muted-foreground">Message</p>
                      <div className="mt-1 p-4 rounded-lg bg-secondary/30 border border-border/60">
                        <p className="text-sm">{app.message}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
