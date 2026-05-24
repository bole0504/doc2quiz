"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "neutral",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "neutral" | "warning" | "success" | "danger";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        variant === "neutral" && "bg-zinc-100 text-zinc-700",
        variant === "warning" && "bg-amber-100 text-amber-800",
        variant === "success" && "bg-emerald-100 text-emerald-800",
        variant === "danger" && "bg-red-100 text-red-800",
        className
      )}
      {...props}
    />
  );
}

