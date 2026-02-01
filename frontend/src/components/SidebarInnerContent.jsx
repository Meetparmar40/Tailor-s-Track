import * as React from "react";
import { NavMain } from "@/components/nav-main";
import NavOrders from "@/components/nav-orders";
import { NavUser } from "@/components/nav-user";
import CompanyLogo from "@/components/CompanyLogo.jsx";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useAuthContext } from "@/components/AuthProvider";
import { useAdminStore } from "@/store/useAdminStore";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function SidebarInnerContent({ state, data, children }) {
  const { userId, user } = useAuthContext();
  const { orders, loading, fetchOrders } = useOrdersStore();
  const { currentWorkspace, getEffectiveUserId, initWorkspace } = useAdminStore();
  const [sidebarOrders, setSidebarOrders] = React.useState([]);
  const hasFetched = React.useRef(false);

  // Initialize workspace from localStorage
  React.useEffect(() => {
    initWorkspace();
  }, [initWorkspace]);

  // Get effective user ID (use workspace owner if in shared workspace)
  const effectiveUserId = React.useMemo(() => {
    return getEffectiveUserId(userId);
  }, [userId, currentWorkspace, getEffectiveUserId]);

  // Fetch orders for sidebar (only 5 most recent)
  React.useEffect(() => {
    if (effectiveUserId && !hasFetched.current) {
      hasFetched.current = true;
      fetchOrders(effectiveUserId, { limit: 5 });
    }
  }, [effectiveUserId, fetchOrders]);

  // Update sidebar orders when store orders change
  React.useEffect(() => {
    if (orders && orders.length > 0) {
      setSidebarOrders(orders.slice(0, 5));
    }
  }, [orders]);

  // Build user data from Clerk user or fallback to data.user
  const userData = React.useMemo(() => {
    if (user) {
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";
      return {
        name: fullName,
        email: user.primaryEmailAddress?.emailAddress || "",
        avatar: user.imageUrl || data.user.avatar,
      };
    }
    return data.user;
  }, [user, data.user]);

  return (
    <>
      <SidebarHeader>
        {state === "expanded" && <CompanyLogo />}
        {children}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavOrders orders={sidebarOrders} loading={loading && sidebarOrders.length === 0} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </>
  );
}