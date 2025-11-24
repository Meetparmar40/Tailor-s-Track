import React from "react";

/**
 * Reusable card with heading row.
 * Uses semantic theme tokens for colors.
 */
export default function SectionCard({ title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-muted bg-surface p-4 bg-primary-foreground">
      {(title || subtitle) && (
        <div className="mb-3 flex items-center justify-between">
          <div>
            {title && <h5 className="text-md font-semibold text-primary">{title}</h5>}
            {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
