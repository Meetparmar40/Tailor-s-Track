import { Fragment, useCallback, useRef } from "react";
import { 
  KanbanBoardColumnFooter, 
  KanbanBoardColumnHeader, 
  KanbanBoardColumnIconButton, 
  KanbanBoardColumnTitle, 
  KanbanBoardProvider, 
  KanbanBoard,
  KanbanBoardColumn
} from "@/components/kanban/kanban.jsx";
import OrderCard from "@/components/OrderCard.jsx";
import { ScrollArea } from "@/components/ui/scroll-area.jsx"
import { Separator } from "@/components/ui/separator.jsx";
import { Spinner, SpinnerContainer } from "@/components/ui/spinner.jsx";

import {
  CircleAlert,
  CircleDotDashed,
  Wrench,
  CircleCheckBig,
  Plus
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
    
    // Updated styling configuration to match OrderCard themes
    const columns = [
    {
        key: 0,
        columnTitle: "New Orders",
        icon: CircleDotDashed,
        theme: {
            text: "text-blue-700",
            bg: "bg-blue-50",
            badge: "bg-blue-100 text-blue-800",
            iconBg: "bg-blue-100/50"
        }
    },
    {
        key: 1,
        columnTitle: "Urgent",
        icon: CircleAlert,
        theme: {
            text: "text-red-700",
            bg: "bg-red-50",
            badge: "bg-red-100 text-red-800",
            iconBg: "bg-red-100/50"
        }
    },
    {
        key: 2,
        columnTitle: "Repair",
        icon: Wrench,
        theme: {
            text: "text-amber-700",
            bg: "bg-amber-50",
            badge: "bg-amber-100 text-amber-800",
            iconBg: "bg-amber-100/50"
        }
    },
    {
        key: 3,
        columnTitle: "Done",
        icon: CircleCheckBig,
        theme: {
            text: "text-emerald-700",
            bg: "bg-emerald-50",
            badge: "bg-emerald-100 text-emerald-800",
            iconBg: "bg-emerald-100/50"
        }
    }
    ];

    const getOrdersByTag = useCallback((tag) => {
        return orders.filter(order => order.tag === tag);
    }, [orders]);

    const handleScroll = useCallback(async (e, tag) => {
      const { target } = e;
      // Added a small buffer (10px) to trigger scroll slightly before hitting rock bottom for smoother UX
      const bottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
      
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
        <KanbanBoard className="gap-4 p-4 h-full">
          {columns.map(({ key, columnTitle, icon: Icon, theme }) => {
            const columnOrders = getOrdersByTag(key);
            
            return (
              <KanbanBoardColumn 
                key={key} 
                columnId={key} 
                onDropOverColumn={handleDrop} 
                // Added background and border for distinct columns
                className="bg-muted/30 border border-border/50 rounded-xl flex flex-col h-full max-h-full min-h-0"
              >
                <KanbanBoardColumnHeader className="p-3 pb-2">
                  <KanbanBoardColumnTitle columnId={key} className="flex items-center w-full">
                    {/* Icon Container */}
                    <div className={`p-1.5 rounded-md mr-2 ${theme.iconBg} ${theme.text}`}>
                        <Icon size={16} strokeWidth={2.5} />
                    </div>
                    
                    <span className="font-semibold text-sm text-foreground">{columnTitle}</span>
                    
                    {/* Count Badge */}
                    <span className={`ml-2 px-2 py-0.5 text-[11px] font-bold rounded-full ${theme.badge}`}>
                      {columnOrders.length}
                    </span>
                  </KanbanBoardColumnTitle>
                  
                  <KanbanBoardColumnIconButton 
                    onClick={() => handleAddOrder(key)}
                    className="hover:bg-muted text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Plus size={18} />
                  </KanbanBoardColumnIconButton>
                </KanbanBoardColumnHeader>

                {/* Separator to define header from content */}
                {/* <Separator className="bg-border/40 mx-3 mb-2" /> */}

                {loading ? (
                    <div className="flex-1 flex items-center justify-center min-h-[200px]">
                        <SpinnerContainer>
                        <Spinner size="lg" />
                        </SpinnerContainer>
                    </div>
                ) : (
                    <ScrollArea
                      onScroll={createScrollHandler(key)}
                      className="flex-1"
                    >
                      <div className="flex flex-col gap-3 p-2">
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
                            </Fragment>
                        ))}
                        
                        {/* Loading More Spinner */}
                        {loadingRefs.current[key] && (
                            <SpinnerContainer className="py-2">
                                <Spinner size="sm" />
                            </SpinnerContainer>
                        )}

                        {/* Empty State */}
                        {columnOrders.length === 0 && !loading && (
                            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground/50 h-full min-h-[150px]">
                                <div className={`p-3 rounded-full bg-muted/50 mb-3`}>
                                    <Icon size={24} className="opacity-40" />
                                </div>
                                <p className="text-xs font-medium text-muted-foreground">No {columnTitle.toLowerCase()}</p>
                            </div>
                        )}
                      </div>
                    </ScrollArea>
                )}
              </KanbanBoardColumn>
            );
          })}
        </KanbanBoard>
      </KanbanBoardProvider>
    )
}