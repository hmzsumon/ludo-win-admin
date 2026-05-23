/* ── Card ───────────────────────────────────────────────────────────────────── */
import React, { ReactNode } from "react";

export interface CardProps {
  children?: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = "" }) => (
  <div
    className={`rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-5 shadow-sm backdrop-blur ${className}`}
  >
    {children}
  </div>
);

export default Card;
