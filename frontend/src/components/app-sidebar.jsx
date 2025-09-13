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

// To do : fetch orders
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "../../assets/images/logomini.png",
  },
  navMain: [
    {
      title: "Home",
      url: "#",
      icon: House,
      isActive: true,
      items: [
        {
          title: "New Orders",
          url: "#",
        },
        {
          title: "In Progress",
          url: "#",
        },
        {
          title: "Repair",
          url: "#",
        },
        {
          title: "Done",
          url: "#",
        },
      ],
    },
    {
      title: "Customers",
      url: "#",
      icon: Contact,
    },
    {
      title: "Measurements",
      url: "#",
      icon: Ruler,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
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
