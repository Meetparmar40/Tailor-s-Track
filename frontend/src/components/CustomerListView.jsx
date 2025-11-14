import { useMemo } from "react";
import { User, Package, Ruler } from "lucide-react";
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { Spinner, SpinnerContainer } from "@/components/ui/spinner.jsx";
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
      className="flex items-center justify-between p-4 border rounded-lg bg-background cursor-pointer hover:bg-accent/50 transition-colors"
      onClick={() => onCustomerSelect(customer)}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
          <User className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-lg">{customer.name}</p>
          <p className="text-sm text-muted-foreground">
            {customer.phone || "No phone number"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm">
        <div className="text-center">
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <Package className="w-4 h-4" />
            <span className="text-xs">Orders</span>
          </div>
          <p className="font-semibold text-lg">{getOrderCount(customer.id)}</p>
        </div>
        
        <div className="text-center">
          <div className="flex items-center gap-1 text-muted-foreground mb-1">
            <Ruler className="w-4 h-4" />
            <span className="text-xs">Measurements</span>
          </div>
          <p className="font-semibold text-lg">{getMeasurementCount(customer.id)}</p>
        </div>

        <div className="text-center min-w-[100px]">
          <p className="text-xs text-muted-foreground mb-1">Last Order</p>
          <p className="font-medium">
            {getLastOrderDate(customer.id)
              ? format(new Date(getLastOrderDate(customer.id)), "MMM d, yyyy")
              : "No orders"
            }
          </p>
        </div>
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
    <div className="space-y-6">
      {Object.entries(groupedCustomers).map(([key, groupCustomers]) => {
        if (groupCustomers.length === 0) return null;

        return (
          <div key={key} className="space-y-3">
            <div className="flex items-center gap-2 px-2">
              <h3 className="font-semibold text-lg text-foreground">
                {groupLabels[key]}
              </h3>
              <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
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
          <User className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg">No customers found</p>
          <p className="text-sm">Add your first customer to get started</p>
        </div>
      )}
    </div>
  );
}
