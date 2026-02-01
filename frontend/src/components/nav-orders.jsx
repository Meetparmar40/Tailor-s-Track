import { MoreHorizontal, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { cn } from "@/lib/utils";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Import icons from assets (same as OrderCard)
import kurtaSvg from "@/assets/icons/kurta.svg";
import suitSvg from "@/assets/icons/suit.svg";
import shirtSvg from "@/assets/icons/shirt.svg";
import pantSvg from "@/assets/icons/pant.svg";
import clothesSvg from "@/assets/icons/clothes.svg";

// Map order types to SVG icons
const typeToIcon = {
  shirt: shirtSvg,
  pants: pantSvg,
  pant: pantSvg,
  suit: suitSvg,
  kurta: kurtaSvg,
  safari: clothesSvg,
  pyjama: clothesSvg,
};

const getIconForType = (type) => {
  if (!type) return clothesSvg;
  const key = String(type).toLowerCase().trim();
  return typeToIcon[key] || clothesSvg;
};

export default function NavOrders({ orders = [], loading = false }) {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleMoreClick = () => {
    setIsNavigating(true);
    // Small delay for visual feedback before navigation
    setTimeout(() => {
      navigate("/");
      // Reset after navigation completes
      setTimeout(() => setIsNavigating(false), 100);
    }, 150);
  };

  const handleOrderClick = (orderId) => {
    navigate(`/orders/${orderId}`);
  };

  // Don't render if no orders and not loading
  if (!loading && orders.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Recent Orders</SidebarGroupLabel>
      <SidebarMenu>
        {loading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map((i) => (
              <SidebarMenuItem key={i}>
                <SidebarMenuButton disabled>
                  <div className="h-4 w-4 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-24 rounded bg-muted animate-pulse" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </>
        ) : (
          // Actual orders
          <>
            {orders.slice(0, 5).map((order) => (
              <SidebarMenuItem key={order.id}>
                <SidebarMenuButton
                  onClick={() => handleOrderClick(order.id)}
                  className="cursor-pointer group/order"
                  tooltip={`${order.type} - ${order.customer_name}`}
                >
                  <img 
                    src={getIconForType(order.type)} 
                    alt={order.type || "order"} 
                    className="h-4 w-4 opacity-70"
                  />
                  <span className="truncate flex-1">
                    {order.customer_name}
                  </span>
                  <span className="text-xs text-muted-foreground opacity-0 group-hover/order:opacity-100 transition-opacity">
                    {order.type}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </>
        )}

        {/* More Button - Interactive with navigation feedback */}
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={handleMoreClick}
            disabled={isNavigating}
            className={cn(
              "text-sidebar-foreground/70 cursor-pointer transition-all duration-200",
              "hover:text-sidebar-foreground hover:bg-sidebar-accent",
              "active:scale-[0.98]",
              isNavigating && "bg-sidebar-accent text-sidebar-foreground"
            )}
          >
            {isNavigating ? (
              <>
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <>
                <MoreHorizontal className="h-4 w-4" />
                <span>View All Orders</span>
                <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}