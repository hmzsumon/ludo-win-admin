"use client";

// ── Minimal UI primitives with forwardRef (required for RHF)
import React from "react";

export const Field: React.FC<{
  label: string;
  error?: string;
  children: React.ReactNode;
}> = ({ label, error, children }) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-[rgb(var(--app-text-soft))]">
      {label}
    </label>
    {children}
    {error ? <p className="text-sm font-medium text-red-500">{error}</p> : null}
  </div>
);

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    {...props}
    className={`h-11 w-full rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] px-3 text-[rgb(var(--app-text))] shadow-sm outline-none ring-0 transition placeholder:text-[rgb(var(--app-text-muted))] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[rgb(var(--app-surface-2))] ${className}`}
  />
));
Input.displayName = "Input";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className = "", ...props }, ref) => (
  <select
    ref={ref}
    {...props}
    className={`h-11 w-full appearance-none rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] px-3 pr-10 text-left text-[rgb(var(--app-text))] shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 dark:bg-[rgb(var(--app-surface-2))] ${className}`}
  />
));
Select.displayName = "Select";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`inline-flex h-11 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 px-5 text-sm font-semibold text-neutral-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
  >
    {children}
  </button>
);
