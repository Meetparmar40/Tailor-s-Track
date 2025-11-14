import * as React from "react"
import {
  House,
  Contact,
  Ruler,
  Frame,
  Map,
  PieChart,
  Settings2,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import  NavOrders from "@/components/nav-orders"
import { NavUser } from "@/components/nav-user"
import  CompanyLogo  from "@/components/CompanyLogo.jsx"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "../../assets/images/logomini.png",
  },
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: House,
      isActive: true,
    },
    {
      title: "Customers",
      url: "/customers",
      icon: Contact,
    },
    {
      title: "Measurements",
      url: "/measurements",
      icon: Ruler,
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "/settings",
        },
        {
          title: "Team",
          url: "/settings/team",
        },
        {
          title: "Billing",
          url: "/settings/billing",
        },
        {
          title: "Limits",
          url: "/settings/limits",
        },
      ],
    },
  ],
  Orders: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}


export function AppSidebar({
  ...props
}) {
  const { state } = useSidebar();
  return (
    <div className="m-2 rounded-xl">
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          {(state == "expanded") && <CompanyLogo />}
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={data.navMain} />
          <NavOrders Orders={data.Orders} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
