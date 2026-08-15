"use client";

import * as React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminLoadingStateProps {
  rows?: number;
  className?: string;
  itemClassName?: string;
  message?: string;
}

export function AdminLoadingState({
  rows = 5,
  className,
  itemClassName,
  message = "Waking up the database — this can take a few seconds after a period of inactivity.",
}: AdminLoadingStateProps) {
  const [showMessage, setShowMessage] = React.useState(false);

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => setShowMessage(true), 3000);
    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-lg border border-border/60 bg-card/80 p-4 shadow-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div
              className={cn(
                "h-4 w-24 rounded-full bg-muted/80 animate-pulse",
                itemClassName
              )}
            />
            <div className="flex h-5 w-5 items-center justify-center">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            </div>
          </div>

          <div className="relative mt-4 space-y-2">
            <div className="h-3 w-full rounded-full bg-muted/80 animate-pulse" />
            <div className="h-3 w-4/5 rounded-full bg-muted/70 animate-pulse" />
            <div className="h-3 w-2/3 rounded-full bg-muted/60 animate-pulse" />
          </div>
        </div>
      ))}

      {showMessage && (
        <div className="flex items-center gap-2 rounded-md border border-amber-500/25 bg-amber-500/5 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
          <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-600/30 border-t-amber-600" />
          <span>{message}</span>
        </div>
      )}
    </div>
  );
}

interface AdminErrorStateProps {
  title: string;
  description: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function AdminErrorState({
  title,
  description,
  onRetry,
  retryLabel = "Retry",
}: AdminErrorStateProps) {
  return (
    <div className="flex min-h-[18rem] flex-col items-center justify-center text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-6 gap-2">
          <RotateCcw className="h-4 w-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
