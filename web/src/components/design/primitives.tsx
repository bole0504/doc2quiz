"use client";

import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function Btn({
  kind = "primary",
  size = "md",
  icon,
  iconRight,
  fullWidth,
  className,
  children,
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: "primary" | "secondary" | "ghost" | "soft" | "danger" | "dangerSolid";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
}) {
  const sizeClass = {
    sm: "h-7 px-2.5 text-[13px] gap-1.5",
    md: "h-[34px] px-3 text-[13.5px] gap-1.5",
    lg: "h-10 px-4 text-sm gap-2",
  }[size];
  const kindClass = {
    primary: "bg-[var(--p)] text-white hover:bg-[var(--pHover)] border-transparent",
    secondary:
      "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)] hover:bg-[var(--bgMuted)]",
    ghost: "bg-transparent text-[var(--textMuted)] border-transparent hover:bg-[var(--bgSubtle)]",
    soft: "bg-[var(--pSoft)] text-[var(--pSoftText)] border-transparent",
    danger:
      "bg-transparent text-[var(--danger)] border border-[var(--border)] hover:bg-[var(--dangerSoft)]",
    dangerSolid: "bg-[var(--danger)] text-white border-transparent",
  }[kind];

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-[7px] font-medium tracking-[-0.005em] transition-colors duration-150 ease-out disabled:opacity-50",
        sizeClass,
        kindClass,
        fullWidth && "w-full",
        className
      )}
      {...rest}
    >
      {icon}
      {children}
      {iconRight}
    </button>
  );
}

export function DesignInput({
  label,
  hint,
  className,
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <label className="text-[13px] font-medium text-[var(--text)]">{label}</label>
      ) : null}
      <input
        className="h-9 w-full rounded-[7px] border border-[var(--border)] bg-[var(--inputBg)] px-[11px] text-[13.5px] text-[var(--text)] outline-none placeholder:text-[var(--textSubtle)] focus:border-[var(--p)]"
        {...rest}
      />
      {hint ? <p className="text-xs text-[var(--textSubtle)]">{hint}</p> : null}
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? (
        <div className="text-[13px] font-medium text-[var(--text)]">{label}</div>
      ) : null}
      {children}
      {hint ? <p className="text-xs text-[var(--textSubtle)]">{hint}</p> : null}
    </div>
  );
}

export function Badge({
  tone = "default",
  dot,
  children,
  className,
}: {
  tone?: "default" | "primary" | "success" | "warning" | "danger";
  dot?: boolean;
  children: ReactNode;
  className?: string;
}) {
  const toneClass = {
    default: "bg-[var(--bgSubtle)] text-[var(--textMuted)]",
    primary: "bg-[var(--pSoft)] text-[var(--pSoftText)]",
    success: "bg-[var(--successSoft)] text-[var(--success)]",
    warning: "bg-[var(--warningSoft)] text-[var(--warning)]",
    danger: "bg-[var(--dangerSoft)] text-[var(--danger)]",
  }[tone];
  const dotClass = {
    default: "bg-[var(--textSubtle)]",
    primary: "bg-[var(--p)]",
    success: "bg-[var(--success)]",
    warning: "bg-[var(--warning)]",
    danger: "bg-[var(--danger)]",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[5px] px-[7px] py-0.5 text-[11.5px] font-medium leading-normal",
        toneClass,
        className
      )}
    >
      {dot ? <span className={cn("h-1.5 w-1.5 rounded-full", dotClass)} /> : null}
      {children}
    </span>
  );
}

export function Avatar({
  name,
  size = 28,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const colors = ["#5B5BD6", "#10B981", "#F59E0B", "#F43F5E", "#8B5CF6", "#06B6D4"];
  const bg = colors[name.charCodeAt(0) % colors.length];
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight text-white",
        className
      )}
      style={{ width: size, height: size, fontSize: size * 0.4, background: bg }}
    >
      {initials}
    </div>
  );
}

export function Card({
  children,
  padding = 20,
  className,
}: {
  children: ReactNode;
  padding?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-[var(--border)] bg-[var(--bg)] shadow-[var(--cardShadow)]",
        className
      )}
      style={{ padding }}
    >
      {children}
    </div>
  );
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn("h-px bg-[var(--border)]", className)} />;
}
