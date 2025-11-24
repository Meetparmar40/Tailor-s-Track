import { useEffect, useState } from "react";
import { useCustomersStore } from "../store/useCustomersStore.js";
import { useOrdersStore } from "../store/useOrdersStore.js";
import { useMeasurementsStore } from "../store/useMeasurementsStore.js";

import Header from "@/components/header.jsx";
import CustomerListView from "@/components/CustomerListView.jsx";
import SheetViewWrapper from "@/components/layout/SheetView/SheetViewWrapper.jsx";

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
    fetchCustomers({ limit: 20 });
  }

  return (
    <div className="mx-4 md:mx-8 my-2">
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
        
        <SheetViewWrapper
            onOpenChange={handleSheetClose}
            open={handleCustomerSelect}
            customer={selectedCustomer}
          />
      </div>
    </div>
  );
}
