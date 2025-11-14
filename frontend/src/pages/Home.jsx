import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useOrdersStore } from "../store/useOrdersStore.js";
import { useViewStore } from "../hooks/use-view-store.js";

import Header from "@/components/header.jsx";
import OrderListView from "@/components/OrderListView.jsx";
import Kanbanboard from "@/components/KanbanBoard.jsx";
import SheetView from "@/components/layout/SheetView.jsx";

export default function HomePage() {

  // hooks and states
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { orders, fetchOrders, fetchMoreOrders, loading, hasMore } = useOrdersStore();
  const { view, setView } = useViewStore();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [defaultTag, setDefaultTag] = useState(0);
  
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
    <div className="mx-8 my-2">
        <Header 
          title="Dashboard" 
          description="Manage your orders Efficiently" 
          onAddNew={handleAddNew}
        />
        <div>
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
          
          {/* Sheet for viewing existing orders */}
          {selectedOrder && (
            <SheetView
              onOpenChange={handleSheetClose}
              open={!!selectedOrder}
              order={selectedOrder}
              mode="view"
            />
          )}
          
          {/* Sheet for creating new orders */}
          {isCreatingOrder && (
            <SheetView
              onOpenChange={handleSheetClose}
              open={isCreatingOrder}
              mode="createOrder"
              defaultTag={defaultTag}
            />
          )}
        </div>
    </div>
  );
}