import React from "react";
import { User } from "lucide-react";

/**
 * Compact customer summary used inside Order sheet.
 */
export default function CustomerMiniCard({ customer, fallbackName, onOpenFull }) {
  const name = customer?.name || fallbackName || "Guest";
  const phone = customer?.phone || "Not set";
  const email = customer?.email || "Not set";

  return (
    <div className="rounded-2xl border border-muted bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-secondary p-2">
            <User className="h-5 w-5 text-on-secondary" />
          </div>
          <div>
            <p className="text-sm font-medium text-primary">{name}</p>
            <p className="text-xs text-muted-foreground">{phone}</p>
          </div>
        </div>
      </div>

      <div className="mt-3 text-sm text-muted-foreground">
        <div>Email: <span className="font-medium text-primary ml-1">{email}</span></div>
      </div>
    </div>
  );
}
