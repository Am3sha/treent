"use client";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage admin account and system settings.</p>
      </div>

      <div className="grid gap-6">
        <div className="rounded-xl border border-border/60 bg-background p-6">
          <h2 className="text-lg font-medium">Account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Email: admin@trennt.com
          </p>
        </div>
      </div>
    </div>
  );
}
