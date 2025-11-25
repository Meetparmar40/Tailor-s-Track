import * as React from "react"
import { NavMain } from "@/components/nav-main"
import NavOrders from "@/components/nav-orders"
import { NavUser } from "@/components/nav-user"
import CompanyLogo from "@/components/CompanyLogo.jsx"
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

export function SidebarInnerContent({ state, data, children }) {
  return (
    <>
      <SidebarHeader>
        {(state === "expanded") && <CompanyLogo />}
        {children}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavOrders Orders={data.Orders} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </>
  )
}
