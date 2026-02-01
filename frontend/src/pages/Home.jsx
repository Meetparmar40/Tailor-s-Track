import { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useOrdersStore } from "../store/useOrdersStore.js";
import { useViewStore } from "../hooks/use-view-store.js";
import { useAuthContext } from "../components/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";

import Header from "@/components/header.jsx";
import OrderListView from "@/components/OrderListView.jsx";
import Kanbanboard from "@/components/KanbanBoard.jsx";

export default function HomePage() {

  // hooks and states
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { orders, fetchOrders, fetchMoreOrders, loading, hasMore } = useOrdersStore();
  const { view, setView } = useViewStore();
  const { userId } = useAuthContext();
  const navigate = useNavigate();

  //effects
  useEffect(() => {
    if (userId) {
      fetchOrders(userId, { limit: 15 });
    }
  }, [userId, fetchOrders]);

  useEffect(() => {
    if (isMobile) setView("list");
    else setView("kanban");
  }, [isMobile, setView]);

  function handleDrop(draggedItem, targetColumn) {
    console.log("Dropped item:", draggedItem, "to column:", targetColumn);
    // TODO: Implement drag and drop logic
  }

  function handleAddOrder(columnTag) {
    navigate(`/orders/new?tag=${columnTag}`);
  } 

  function handleViewDetails(order) {
    navigate(`/orders/${order.id}`);
  }

  function handleAddNew() {
    navigate("/orders/new");
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
              fetchMoreOrders={() => fetchMoreOrders(userId)}
              handleDrop={handleDrop}
              handleAddOrder={handleAddOrder}
              onOrderSelect={handleViewDetails}
            />
          ) : (
            <OrderListView
              orders={orders}
              loading={loading}
              onOrderSelect={handleViewDetails}
              handleAddOrder={handleAddOrder}
            />
          )
        }
      </div>
    </div>
  );
}