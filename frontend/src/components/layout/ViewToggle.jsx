"use client"

import { ToggleGroup } from "@ark-ui/react/toggle-group"
import { LayoutDashboard, List } from "lucide-react"


export default function ViewToggle() {
  const items = [
    { value: "board", label: "Board", icon : LayoutDashboard},
    { value: "list", label: "List", icon : List },
  ]

  return (
    <ToggleGroup.Root
      type="single"
      defaultValue={["board"]}
      className="inline-flex rounded-xl border border-gray-300 bg-gray-100 dark:bg-gray-800"
    >
      {items.map(({ value, label, icon: Icon }) => (
        <ToggleGroup.Item 
          key={value}
          value={value}
          className="flex gap-2 w-50 items-center justify-between px-6 py-1 text-md font-medium rounded-xl transition-colors 
                     data-[state=on]:bg-white data-[state=on]:shadow-sm data-[state=on]:text-gray-900
                     data-[state=off]:text-gray-500 hover:text-gray-700"
        >
          <Icon className="h-4 w-4"/>
          <p className="pb-1">{label}</p>
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
