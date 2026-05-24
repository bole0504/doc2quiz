"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm outline-none transition placeholder:text-zinc-400 focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  );
}

