import React from "react";
import OrdersTabContent from "./OrdersTabContent";

export default function OrdersTab({ controller }) {
  const { state, handlers } = controller;

  return (
    <OrdersTabContent
      localOrder={state.localOrder}
      customerOrders={state.customerOrders}
      loadingOrders={state.loadingOrders}
      editingOrderId={state.editingOrderId}
      orderCardFormData={state.orderCardForms}
      onEditOrder={handlers.handleEditOrderCard}
      onSaveOrder={handlers.handleSaveOrderCard}
      onCancelOrder={handlers.handleCancelOrderCard}
      onDeleteOrder={(id, name) => handlers.openDeleteConfirmation("order", id, name)}
      onInputChange={handlers.handleOrderCardInputChange}
      onCreateNew={() => handlers.setCreating({ newOrder: true })}
    />
  );
}
