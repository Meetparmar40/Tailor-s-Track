import { useEffect, useState } from "react";
import { measurementTemplates } from "../constants";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useCustomersStore } from "@/store/useCustomersStore";
import { useMeasurementsStore } from "@/store/useMeasurementsStore";

export default function useOrderSheetController({ order, defaultTag = 0, onClose }) {
  const ordersStore = useOrdersStore();
  const customersStore = useCustomersStore();
  const measurementsStore = useMeasurementsStore();

  const [stateOrder, setStateOrder] = useState(order || null);
  const [orderForm, setOrderForm] = useState({
    customer_id: order?.customer_id || null,
    type: order?.type || "",
    quantity: order?.quantity || 1,
    status: order?.status || "",
    notes: order?.notes || "",
    tag: order?.tag ?? defaultTag,
    due_date: order?.due_date ? order.due_date.split("T")[0] : "",
  });

  const [editing, setEditing] = useState({ order: false, measurement: false });
  const [isSaving, setIsSaving] = useState(false);

  const activeCustomerId = stateOrder?.customer_id || orderForm.customer_id;
  const customerFromStore = customersStore.customers?.find(c => c.id === activeCustomerId);

  useEffect(() => {
    setStateOrder(order);
    setOrderForm({
      customer_id: order?.customer_id || null,
      type: order?.type || "",
      quantity: order?.quantity || 1,
      status: order?.status || "",
      notes: order?.notes || "",
      tag: order?.tag ?? defaultTag,
      due_date: order?.due_date ? order.due_date.split("T")[0] : "",
    });

    if (order?.customer_id) {
      if (!customersStore.customers?.find(c => c.id === order.customer_id)) {
        customersStore.fetchCustomers({ limit: 100 });
      }
      measurementsStore.fetchMeasurementsOfCustomer(order.customer_id).catch(()=>{});
    }

  }, [order]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      // create order
      if (!stateOrder?.id) {
        const customerId = orderForm.customer_id || order?.customer_id;
        if (!customerId) {
          console.error("Customer ID is required to create an order");
          return;
        }
        const res = await ordersStore.addOrder(customerId, orderForm);
        if (res?.success) {
          setStateOrder(res.data);
          setEditing({ order: false, measurement: editing.measurement });
          onClose?.();
        }
      //update order
      } else {
        const res = await ordersStore.updateOrders(stateOrder.id, orderForm);
        if (res?.success) {
          setStateOrder(res.data);
          setEditing({ order: false, measurement: editing.measurement });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAll = () => {
    setOrderForm({
      type: stateOrder?.type || "",
      quantity: stateOrder?.quantity || 1,
      status: stateOrder?.status || "",
      notes: stateOrder?.notes || "",
      tag: stateOrder?.tag ?? defaultTag,
      due_date: stateOrder?.due_date ? stateOrder.due_date.split("T")[0] : "",
    });
    setEditing({ order: false, measurement: false });
  };

  const openCustomerSheet = (customerId) => {
    // assume higher-level router or modal controller will open CustomerSheetView
    // for now, we expose a simple behavior: fetch and set local customer. Caller may integrate navigation.
    if (!customersStore.customers?.find(c => c.id === customerId)) {
      customersStore.fetchCustomers({ limit: 100 });
    }
    // integrate with app: call onClose to close this and open CustomerSheetView or trigger route
    onClose?.();
    // parent should display Customer sheet.
  };

  const openDeleteConfirmation = (type, id, name) => {
    // delegate to stores: or raise event; for simplicity call delete and close
    if (type === "order") {
      ordersStore.deleteOrder(id).then(res => {
        if (res?.success) onClose?.();
      }).catch(e => console.error(e));
    }
  };

  const deleteMeasurement = (measurementId) => {
    measurementsStore.deleteMeasurement(measurementId).then(res => {
      if (res?.success) {
        // Refresh measurements list
        if (activeCustomerId) {
          measurementsStore.fetchMeasurementsOfCustomer(activeCustomerId).catch(()=>{});
        }
      }
    }).catch(e => console.error(e));
  };

  const createMeasurement = async (payload) => {
    if (activeCustomerId) {
      await measurementsStore.addMeasurement(activeCustomerId, payload);
    } else {
      console.error("No customer ID found for creating measurement");
    }
  };

  const updateMeasurement = async (measurementId, payload) => {
    if (activeCustomerId) {
      await measurementsStore.updateMeasurement(activeCustomerId, measurementId, payload);
    }
  };

  return {
    state: {
      order: stateOrder,
      orderForm,
      customerFromStore,
    },
    handlers: {
      setEditing: (payload) => setEditing(prev => ({ ...prev, ...payload })),
      handleSaveAll,
      handleCancelAll,
      openCustomerSheet,
      openDeleteConfirmation,
      deleteMeasurement,
      createMeasurement,
      updateMeasurement,
      setOrderForm: (payload) => setOrderForm(prev => ({ ...prev, ...payload })),
      setEditingDirect: setEditing,
    },
    ordersStore,
    customersStore,
    measurementsStore,
    isSaving,
    isAnyEditing: editing.order || editing.measurement,
    displayName: stateOrder?.customer_name || `${stateOrder?.type || "Order"}`,
  };
}
