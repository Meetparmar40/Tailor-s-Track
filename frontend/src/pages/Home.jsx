import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useOrdersStore } from "../store/useOrdersStore.js";
import { useViewStore } from "../hooks/use-view-store.js";

import Header from "@/components/header.jsx";
import OrderListView from "@/components/OrderListView.jsx";
import Kanbanboard from "@/components/KanbanBoard.jsx";
import SheetViewWrapper from "@/components/layout/SheetView/SheetViewWrapper.jsx";

export default function HomePage() {

  // hooks and states
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { orders, fetchOrders, fetchMoreOrders, loading, hasMore } = useOrdersStore();
  const { view, setView } = useViewStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  //effects
  useEffect(() => {
    fetchOrders({ limit: 15 });
  }, [fetchOrders]);

  useEffect(() => {
    if (isMobile) setView("list");
    else setView("kanban");
  }, [isMobile, setView]);

  function handleDrop(draggedItem, targetColumn) {
    console.log("Dropped item:", draggedItem, "to column:", targetColumn);
    // TODO: Implement drag and drop logic
  }

  function handleAddOrder(columnTag) {
    setDefaultTag(columnTag);
    setIsCreatingOrder(true);
    setSelectedOrder(null);
  }

  function handleViewDetails(order) {
    setSelectedOrder(order);
    setIsCreatingOrder(false);
  }

  function handleSheetClose() {
    setSelectedOrder(null);
    setIsCreatingOrder(false);
    // Refresh orders after potential changes
    fetchOrders({ limit: 15 });
  }

  function handleAddNew() {
    setDefaultTag(0); // Default to "New" tag
    setIsCreatingOrder(true);
    setSelectedOrder(null);
  }
  return (
    <div className="mx-8 my-2 flex flex-col h-[calc(100vh-1rem)]">
        <Header 
          title="Dashboard" 
          description="Manage your orders Efficiently" 
          onAddNew={handleAddNew}
        />
        <div className="flex-1 min-h-0">
          {
            view === "kanban" ? (
              <Kanbanboard 
                orders={orders}
                loading={loading}
                hasMore={hasMore}
                fetchMoreOrders={fetchMoreOrders}
                handleDrop={handleDrop}
                handleAddOrder={handleAddOrder}
                onOrderSelect={handleViewDetails}
              />
            ) : (
              <OrderListView 
                orders={orders}
                loading={loading}
                onOrderSelect={handleViewDetails}
              />
            )
          }
          
          <SheetViewWrapper
              onOpenChange={handleSheetClose}
              open={!!selectedOrder}
              order={selectedOrder}
            />
        </div>
    </div>
  );
}