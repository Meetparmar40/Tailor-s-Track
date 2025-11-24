import { useMemo } from "react";
import { Package, Ruler } from "lucide-react";
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { Spinner, SpinnerContainer } from "@/components/ui/spinner.jsx";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.jsx";
import { useOrdersStore } from "@/store/useOrdersStore.js";
import { useMeasurementsStore } from "@/store/useMeasurementsStore.js";

export default function CustomerListView({ customers, loading, onCustomerSelect }) {
  const { orders } = useOrdersStore();
  const { allMeasurements } = useMeasurementsStore();

  const getOrderCount = (customerId) => {
    return orders.filter(order => order.customer_id === customerId).length;
  };

  const getMeasurementCount = (customerId) => {
    return allMeasurements.filter(measurement => measurement.customer_id === customerId).length;
  };

  const getLastOrderDate = (customerId) => {
    const customerOrders = orders.filter(order => order.customer_id === customerId);
    if (customerOrders.length === 0) return null;

    const sortedOrders = [...customerOrders].sort((a, b) => {
      const dateA = new Date(a.order_date);
      const dateB = new Date(b.order_date);
      return dateB - dateA;
    });
    
    return sortedOrders[0].order_date;
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const groupedCustomers = useMemo(() => {
    const groups = {
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: []
    };

    customers.forEach(customer => {
      const lastOrderDate = getLastOrderDate(customer.id);
      const lastDate = lastOrderDate ? new Date(lastOrderDate) : null;
      
      if (!lastDate) {
        groups.older.push(customer);
      } else if (isToday(lastDate)) {
        groups.today.push(customer);
      } else if (isYesterday(lastDate)) {
        groups.yesterday.push(customer);
      } else if (isThisWeek(lastDate, { weekStartsOn: 1 })) {
        groups.thisWeek.push(customer);
      } else if (isThisMonth(lastDate)) {
        groups.thisMonth.push(customer);
      } else {
        groups.older.push(customer);
      }
    });

    Object.keys(groups).forEach(key => {
      groups[key].sort((a, b) => {
        const dateA = getLastOrderDate(a.id);
        const dateB = getLastOrderDate(b.id);
        const timeA = dateA ? new Date(dateA).getTime() : 0;
        const timeB = dateB ? new Date(dateB).getTime() : 0;
        return timeB - timeA;
      });
    });

    return groups;
  }, [customers, orders]);

  const groupLabels = {
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This Week",
    thisMonth: "This Month",
    older: "Older"
  };

  const renderCustomerCard = (customer) => (
    <div
      key={customer.id}
      className="group flex items-center justify-between p-4 border rounded-lg bg-card hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer gap-3"
      onClick={() => onCustomerSelect(customer)}
    >
      {/* Left: Avatar & Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Avatar className="h-10 w-10 border border-border shrink-0">
          <AvatarFallback className="bg-primary/10 text-primary font-medium">
            {getInitials(customer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 overflow-hidden">
          <p className="font-bold text-foreground truncate">{customer.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {customer.phone || "No phone"}
          </p>
        </div>
      </div>

      {/* Middle: Stats Pills */}
      <div className="hidden md:flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/40 border border-transparent group-hover:border-border/50 transition-colors">
          <Package className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            {getOrderCount(customer.id)} <span className="hidden lg:inline">Orders</span>
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/40 border border-transparent group-hover:border-border/50 transition-colors">
          <Ruler className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium text-foreground">
            {getMeasurementCount(customer.id)} <span className="hidden lg:inline">Measurements</span>
          </span>
        </div>
      </div>

      {/* Right: Last Order Date */}
      <div className="text-right shrink-0">
        <p className="text-xs text-muted-foreground mb-0.5">Last Order</p>
        <p className="text-sm font-medium text-foreground">
          {getLastOrderDate(customer.id)
            ? format(new Date(getLastOrderDate(customer.id)), "MMM d, yyyy")
            : "-"
          }
        </p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <SpinnerContainer>
        <Spinner size="xl" />
      </SpinnerContainer>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedCustomers).map(([key, groupCustomers]) => {
        if (groupCustomers.length === 0) return null;

        return (
          <div key={key} className="space-y-3">
            {/* Group Header */}
            <div className="flex items-center gap-3 pb-2 border-b border-border">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                {groupLabels[key]}
              </h3>
              <span className="px-2 py-0.5 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                {groupCustomers.length}
              </span>
            </div>
            
            <div className="space-y-2">
              {groupCustomers.map(renderCustomerCard)}
            </div>
          </div>
        );
      })}

      {customers.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
            <Avatar className="w-8 h-8 opacity-20">
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
          </div>
          <p className="text-lg font-medium text-foreground">No customers found</p>
          <p className="text-sm">Add your first customer to get started</p>
        </div>
      )}
    </div>
  );
}
