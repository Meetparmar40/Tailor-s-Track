import { useEffect, useState } from "react";
import { useCustomersStore } from "../store/useCustomersStore.js";
import { useOrdersStore } from "../store/useOrdersStore.js";
import { useMeasurementsStore } from "../store/useMeasurementsStore.js";
import { useNavigate } from "react-router-dom";

import Header from "@/components/header.jsx";
import CustomerListView from "@/components/CustomerListView.jsx";

export default function CustomersPage() {
  const { customers, fetchCustomers, fetchMoreCustomers, loading, hasMore } = useCustomersStore();
  const { fetchOrders } = useOrdersStore();
  const { fetchAllMeasurements } = useMeasurementsStore();
  const navigate = useNavigate();

  const handleAddNewCustomer = () => {
    navigate("/customers/new");
  };

  const handleCustomerSelect = (customer) => {
    navigate(`/customers/${customer.id}`);
  };

  // Todo : apply infinite scroll for customers, orders and measurements
  useEffect(() => {
    fetchCustomers({ limit: 20 });
    fetchOrders({ limit: 1000 });
    fetchAllMeasurements({ limit: 1000 });
  }, [fetchCustomers, fetchOrders, fetchAllMeasurements]);

  return (
    <div className="h-full flex flex-col">
      <Header
        title="Customers"
        description="Manage your customers"
        onAddNew={handleAddNewCustomer}
      />
      <div className="flex-1 overflow-hidden">
        <CustomerListView
          customers={customers}
          loading={loading}
          onCustomerSelect={handleCustomerSelect}
        />
      </div>
    </div>
  );
}
