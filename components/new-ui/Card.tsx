/* ────────── lightweight Card ────────── */
import { ReactNode } from "react";

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  right?: ReactNode;
};

export default function Card({
  title,
  children,
  className = "",
  right,
}: CardProps) {
  return (
    <div
      className={`rounded-lg bg-[rgb(var(--app-surface))] border border-[rgb(var(--app-border))] px-2 py-4 ${className}`}
    >
      {(title || right) && (
        <div className="mb-3 flex items-center justify-between">
          {title ? (
            <h3 className="text-sm text-[rgb(var(--app-text-soft))]">{title}</h3>
          ) : (
            <span />
          )}
          {right}
        </div>
      )}
      {children}
    </div>
  );
}
