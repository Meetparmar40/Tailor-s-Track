import { Fragment, useCallback, useRef } from "react";
import { KanbanBoardColumnFooter, KanbanBoardColumnHeader, KanbanBoardColumnIconButton, KanbanBoardColumnTitle, KanbanBoardProvider, KanbanBoardColumnList } from "@/components/kanban/kanban.jsx";
import { KanbanBoard } from "@/components/kanban/kanban.jsx";
import { KanbanBoardColumn } from "@/components/kanban/kanban.jsx";
import OrderCard from "@/components/OrderCard.jsx";
import { ScrollArea} from "@/components/ui/scroll-area.jsx"
import { Separator } from "@/components/ui/separator.jsx";
import { Spinner, SpinnerContainer } from "@/components/ui/spinner.jsx";

import {
  CircleAlert,
  CirclePlus,
  CircleDotDashed,
  Wrench,
  CircleCheckBig
} from "lucide-react"

export default function Kanbanboard({
  orders,
  loading,
  hasMore,
  fetchMoreOrders,
  handleDrop,
  handleAddOrder,
  onOrderSelect
}){
    const loadingRefs = useRef({
      0: false,
      1: false,
      2: false,
      3: false
    });
    
    const columns = [
    {
        key: 0,
        columnTitle: "New Orders",
        icon: CircleDotDashed,
        iconColor: "#64748b"
    },
    {
        key: 1,
        columnTitle: "Urgent",
        icon: CircleAlert,
        iconColor: "#f87171"
    },
    {
        key: 2,
        columnTitle: "Repair",
        icon: Wrench,
        iconColor: "#fbbf24"
    },
    {
        key: 3,
        columnTitle: "Done",
        icon: CircleCheckBig,
        iconColor: "#10b981"
    }
    ];

    const getOrdersByTag = useCallback((tag) => {
        return orders.filter(order => order.tag === tag);
    }, [orders]);

    const handleScroll = useCallback(async (e, tag) => {
      const { target } = e;
      const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
      
      if (bottom && !loadingRefs.current[tag] && hasMore) {
        loadingRefs.current[tag] = true;
        
        try {
          const filteredOrders = getOrdersByTag(tag);
          const lastOrder = filteredOrders[filteredOrders.length - 1];
          
          if (lastOrder) {
            await fetchMoreOrders({
              limit: 10,
              lastDate: lastOrder.order_date,
              tag: tag
            });
          }
        } catch (error) {
          console.error("Error loading more orders:", error);
        } finally {
          loadingRefs.current[tag] = false;
        }
      }
    }, [fetchMoreOrders, hasMore, getOrdersByTag]);
  
    const createScrollHandler = (tag) => (e) => handleScroll(e, tag);
    
    return (
      <KanbanBoardProvider>
        <KanbanBoard>
          {columns.map(({ key, columnTitle, icon: Icon, iconColor }) => {
            const columnOrders = getOrdersByTag(key);
            
            return (
              <KanbanBoardColumn key={key} columnId={key} onDropOverColumn={handleDrop} className="bg-primary-foreground">
              <KanbanBoardColumnHeader>
                <KanbanBoardColumnTitle columnId={key}>
                <Icon color={iconColor} size={18} />
                <span className="mb-1">{columnTitle}</span>
                <span className="ml-2 px-2 py-1 text-xs bg-gray-100 rounded-full">
                  {columnOrders.length}
                </span>
                </KanbanBoardColumnTitle>
                <KanbanBoardColumnIconButton onClick={() => handleAddOrder(key)}>
                <CirclePlus size={18} />
                </KanbanBoardColumnIconButton>
              </KanbanBoardColumnHeader>
              {loading ? (
                <SpinnerContainer>
                  <Spinner size="lg" />
                </SpinnerContainer>
              ) : (
                <KanbanBoardColumnList
                  onScroll={createScrollHandler(key)}
                  className="overflow-y-auto max-h-[calc(100vh-212px)]"
                >
                  {columnOrders.map((order) => (
                    <Fragment key={order.id}>
                      <OrderCard
                        id={order.id}
                        customer_name={order.customer_name}
                        order_date={order.order_date}
                        type={order.type}
                        quantity={order.quantity}
                        tag={order.tag}
                        notes={order.notes}
                        onClick={() => onOrderSelect(order)}
                      />
                      <Separator className="my-2" />
                    </Fragment>
                  ))}
                  {loadingRefs.current[key] && (
                    <SpinnerContainer className="py-4">
                      <Spinner />
                    </SpinnerContainer>
                  )}
                  {columnOrders.length === 0 && !loading && (
                  <div className="text-center py-8 text-gray-400">
                    <Icon color={iconColor} size={32} className="mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No orders in {columnTitle.toLowerCase()}</p>
                  </div>
                  )}
                </KanbanBoardColumnList>
              )}
              </KanbanBoardColumn>
            );
          })}
        </KanbanBoard>
      </KanbanBoardProvider>
    )
}