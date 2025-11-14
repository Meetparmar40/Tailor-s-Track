import React from "react";
import CustomerInformationCard from "./CustomerInformationCard";
import OrderInformationCard from "./OrderInformationCard";

export default function DetailsTab({ controller }) {
  const { state, handlers, isOrderContext, isCustomerContext, isCreating } = controller;

  return (
    <>
      <CustomerInformationCard
        isEditing={state.editing.customer}
        isCreating={isCreating}
        mode={state.mode}
        isOrderContext={isOrderContext}
        isCustomerContext={isCustomerContext}
        customerFormData={state.customerForm}
        onInputChange={handlers.handleCustomerInputChange}
        onEdit={() => handlers.setEditing({ customer: true })}
        onDelete={() => handlers.openDeleteConfirmation("customer", state.localCustomer?.id, state.localCustomer?.name)}
        onRemove={() => handlers.openDeleteConfirmation("removeCustomer", state.localOrder?.id, state.customerForm.name)}
        customers={controller.customersStore.customers}
        selectedCustomerId={state.selectedCustomerId}
        onCustomerSelect={handlers.handleCustomerSelect}
        openCustomerCombo={state.openCustomerCombo}
        onOpenCustomerCombo={handlers.setOpenCustomerCombo}
        customerSearch={state.customerSearch}
        onCustomerSearchChange={handlers.setCustomerSearch}
      />

      {(isOrderContext || state.mode === "createOrder") && (
        <OrderInformationCard
          isEditing={state.editing.order}
          isCreating={state.mode === "createOrder"}
          orderFormData={state.orderForm}
          onInputChange={handlers.handleOrderInputChange}
          onEdit={() => handlers.setEditing({ order: true })}
          onDelete={() => handlers.openDeleteConfirmation("order", state.localOrder?.id, state.localOrder?.customer_name)}
        />
      )}
    </>
  );
}
