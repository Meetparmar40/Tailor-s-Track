import * as React from "react"
import { SidebarInnerContent } from "@/components/SidebarInnerContent"
import { data } from "@/components/sidebar-data"
import {
  Sidebar,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"

export function AppSidebar({
  ...props
}) {
  const { state } = useSidebar();
  return (
    <div className="m-2 rounded-xl">
      <Sidebar collapsible="icon" {...props}>
        <SidebarInnerContent state={state} data={data}>
          <SidebarTrigger />
        </SidebarInnerContent>
      </Sidebar>
    </div>
  );
}
