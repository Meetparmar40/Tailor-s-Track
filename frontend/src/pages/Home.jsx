import { useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useOrdersStore } from "../store/useOrdersStore.js";
import { KanbanBoardProvider } from "@/components/kanban/kanban.jsx";
import { KanbanBoard } from "@/components/kanban/kanban.jsx";
import { KanbanBoardColumn } from "@/components/kanban/kanban.jsx";
import Header from "@/components/header.jsx";

export default function HomePage(){
  const isMobile = useMediaQuery({query :"(max-width: 768px)"});
  const { orders, fetchOrders } = useOrdersStore();

  useEffect(() => {
    fetchOrders({limit : 15});
  }, [fetchOrders]);

  return (
    <div className="mx-4 my-2">
      {/* Header */}
      <Header title="Dashboard" discription="Manage your orders Efficiently" />
        {/* Board */}
      <KanbanBoardProvider >
        <div className="m-5">
          <KanbanBoard>
            <KanbanBoardColumn  />
            <KanbanBoardColumn  />
            <KanbanBoardColumn  />
            <KanbanBoardColumn  />
          </KanbanBoard>
        </div>
      </KanbanBoardProvider> 
    </div>
  )
}