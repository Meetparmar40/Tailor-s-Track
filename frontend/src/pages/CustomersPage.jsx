import { useEffect, useState } from "react";
import { useCustomersStore } from "../store/useCustomersStore.js";
import { useOrdersStore } from "../store/useOrdersStore.js";
import { useMeasurementsStore } from "../store/useMeasurementsStore.js";

import Header from "@/components/header.jsx";
import CustomerListView from "@/components/CustomerListView.jsx";
import SheetView from "@/components/layout/SheetView.jsx";

export default function CustomersPage() {
  const { customers, fetchCustomers, fetchMoreCustomers, loading, hasMore } = useCustomersStore();
  const { fetchOrders } = useOrdersStore();
  const { fetchAllMeasurements } = useMeasurementsStore();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

  // Todo : apply infinite scroll for customers, orders and measurements
  useEffect(() => {
    fetchCustomers({ limit: 20 });

    fetchOrders({ limit: 1000 });
    
    fetchAllMeasurements({ limit: 1000 });
  }, [fetchCustomers, fetchOrders, fetchAllMeasurements]);

  function handleCustomerSelect(customer) {
    setSelectedCustomer(customer);
    setIsCreatingCustomer(false);
  }

  function handleAddNewCustomer() {
    setIsCreatingCustomer(true);
    setSelectedCustomer(null);
  }

  function handleSheetClose() {
    setSelectedCustomer(null);
    setIsCreatingCustomer(false);
    // Refresh customers after potential changes
    fetchCustomers({ limit: 20 });
  }

  return (
    <div className="mx-8 my-2">
      <Header 
        title="Customers" 
        description="Manage your customers" 
        onAddNew={handleAddNewCustomer}
      />
      <div>
        <CustomerListView 
          customers={customers}
          loading={loading}
          onCustomerSelect={handleCustomerSelect}
        />
        
        {/* Sheet for viewing existing customers */}
        {selectedCustomer && (
          <SheetView
            onOpenChange={handleSheetClose}
            open={!!selectedCustomer}
            customer={selectedCustomer}
            mode="view"
          />
        )}
        
        {/* Sheet for creating new customers */}
        {isCreatingCustomer && (
          <SheetView
            onOpenChange={handleSheetClose}
            open={isCreatingCustomer}
            mode="createCustomer"
          />
        )}
      </div>
    </div>
  );
}
