"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export function Button({
  className,
  variant = "default",
  size = "md",
  asChild,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md";
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200 disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-zinc-900 text-white hover:bg-zinc-800",
        variant === "outline" && "border bg-white hover:bg-zinc-50",
        variant === "destructive" &&
          "border border-red-200 bg-red-50 text-red-800 hover:bg-red-100",
        size === "md" && "h-10 px-4",
        size === "sm" && "h-9 px-3",
        className
      )}
      {...props}
    />
  );
}

