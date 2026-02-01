import * as React from "react"
import { SidebarInnerContent } from "@/components/SidebarInnerContent"
import { data } from "@/components/sidebar-data"
import { useSettingsStore } from "@/store/useSettingsStore"
import {
  Sidebar,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"

export function AppSidebar({
  ...props
}) {
  const { state, setOpen } = useSidebar();
  const { settings } = useSettingsStore();

  // Apply sidebar collapsed setting on mount
  React.useEffect(() => {
    if (settings.sidebar_collapsed) {
      setOpen(false);
    }
  }, [settings.sidebar_collapsed, setOpen]);

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
