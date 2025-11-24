import React from "react";
import OrderSheetView from "./OrderSheetView";
import CustomerSheetView from "./CustomerSheetView";

/**
 * Choose which sheet to open based on props.
 * - If `order` prop exists => Order-first
 * - Else if `customer` prop exists => Customer-first
 */
export default function SheetViewWrapper(props) {
  const { order, customer, ...rest } = props;
  if (order) return <OrderSheetView order={order} {...rest} />;
  if (customer) return <CustomerSheetView customer={customer} {...rest} />;
  return null;
}
