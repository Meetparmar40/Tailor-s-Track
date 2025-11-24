import React from "react";
import { Edit, Trash2 } from "lucide-react";

/**
 * Small icon-only action bar for headers (edit/delete).
 * Use variant classes or tokens from your Button component if desired.
 */
export default function ActionBar({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2 bg-primary-foreground">
      <button onClick={onEdit} aria-label="Edit" className="rounded p-2 hover:bg-accent/10">
        <Edit className="h-4 w-4 text-primary" />
      </button>
      <button onClick={onDelete} aria-label="Delete" className="rounded p-2 hover:bg-danger/10">
        <Trash2 className="h-4 w-4 text-destructive" />
      </button>
    </div>
  );
}
