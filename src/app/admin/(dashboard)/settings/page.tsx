"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Copy, Check, Shield, Clock, KeyRound } from "lucide-react";

const SESSION_MAX_AGE = 8 * 60 * 60; // 8 hours, matching auth config

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<{
    newHash: string;
    instructions: string;
  } | null>(null);
  const [copied, setCopied] = React.useState(false);

  const passwordErrors: string[] = [];
  if (newPassword.length > 0 && newPassword.length < 12) {
    passwordErrors.push("At least 12 characters");
  }
  if (newPassword.length > 0 && newPassword !== confirmPassword) {
    passwordErrors.push("Passwords do not match");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordErrors.length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!data.ok) {
        toast({
          title: "Error",
          description: data.error || "Failed to change password.",
          variant: "destructive",
        });
        return;
      }

      setResult({ newHash: data.newHash, instructions: data.instructions });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "Password hash generated",
        description: "See instructions below to update your hosting environment.",
      });
    } catch {
      toast({
        title: "Network error",
        description: "Could not reach the server. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function copyHash() {
    if (!result?.newHash) return;
    try {
      await navigator.clipboard.writeText(result.newHash);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please select and copy the hash manually.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage admin account and system settings.
        </p>
      </div>

      {/* Account Info */}
      <div className="rounded-xl border border-border/60 bg-background p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-medium">Account</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium">
              {session?.user?.email ?? "info@trennt.sa"}
            </span>
          </div>
        </div>
      </div>

      {/* Session Info */}
      <div className="rounded-xl border border-border/60 bg-background p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-medium">Session</h2>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Session duration</span>
            <span className="font-medium">
              {Math.floor(SESSION_MAX_AGE / 3600)} hours
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            You will be automatically logged out after this period. Sign in
            again to start a new session.
          </p>
        </div>
      </div>

      <Separator />

      {/* Change Password */}
      <div className="rounded-xl border border-border/60 bg-background p-6">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-medium">Change Password</h2>
        </div>

        {result ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-100">
              <p className="font-medium mb-2">Manual update required</p>
              <p className="mb-3">{result.instructions}</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all rounded bg-white/80 dark:bg-black/40 p-2 text-xs font-mono border border-amber-200 dark:border-amber-800">
                  {result.newHash}
                </code>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyHash}
                  className="shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setResult(null)}
              className="w-full"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrent ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNew ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm new password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {passwordErrors.length > 0 && (
              <ul className="text-sm text-destructive space-y-1">
                {passwordErrors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            )}

            <Button
              type="submit"
              disabled={loading || passwordErrors.length > 0}
              className="w-full"
            >
              {loading ? "Generating hash..." : "Generate new password hash"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              This generates a new bcrypt hash. You will then need to manually
              update the{" "}
              <code className="font-mono">ADMIN_PASSWORD_HASH</code> environment
              variable in your hosting platform.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
