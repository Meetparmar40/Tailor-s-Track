"use client"

import { ToggleGroup } from "@ark-ui/react/toggle-group"
import { LayoutDashboard, List } from "lucide-react"

export default function ViewToggle({ setView, view }) {
  const items = [
    { value: "kanban", label: "Board", icon: LayoutDashboard },
    { value: "list", label: "List", icon: List },
  ]

  return (
    <ToggleGroup.Root
      type="single"
      value={view}
      onValueChange={(details) => {
        if (details.value) {
          setView(details.value[0]);
        }
      }}
      className="mx-2 inline-flex rounded-lg border border-border bg-primary-foreground dark:bg-gray-800"
    >
      {items.map(({ value, label, icon: Icon }) => (
        <ToggleGroup.Item
          key={value}
          value={value}
          className="flex gap-2 w-35 h-9 items-center justify-center px-4 py-1 text-md font-medium rounded-lg transition-colors 
                     data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:text-accent-foreground
                     data-[state=off]:text-muted-foreground hover:text-gray-700"
        >
          <Icon className="h-4 w-4" />
          <p className="hidden md:block">{label}</p>
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}