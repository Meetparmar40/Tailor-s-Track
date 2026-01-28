import { useEffect, useState } from "react";
import { measurementTemplates } from "../constants";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useCustomersStore } from "@/store/useCustomersStore";
import { useMeasurementsStore } from "@/store/useMeasurementsStore";
import { useAuthContext } from "@/components/AuthProvider";

export default function useOrderSheetController({ order, defaultTag = 0, onClose }) {
  const ordersStore = useOrdersStore();
  const customersStore = useCustomersStore();
  const measurementsStore = useMeasurementsStore();
  const { userId } = useAuthContext();

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

    if (order?.customer_id && userId) {
      if (!customersStore.customers?.find(c => c.id === order.customer_id)) {
        customersStore.fetchCustomers(userId, { limit: 100 });
      }
      measurementsStore.fetchMeasurementsOfCustomer(userId, order.customer_id).catch(()=>{});
    }

  }, [order, userId]);

  const handleSaveAll = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      // create order
      if (!stateOrder?.id) {
        const customerId = orderForm.customer_id || order?.customer_id;
        if (!customerId) {
          console.error("Customer ID is required to create an order");
          return;
        }
        const res = await ordersStore.addOrder(userId, customerId, orderForm);
        if (res?.success) {
          setStateOrder(res.data);
          setEditing({ order: false, measurement: editing.measurement });
          onClose?.();
        }
      //update order
      } else {
        const res = await ordersStore.updateOrders(userId, stateOrder.id, orderForm);
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
    if (!customersStore.customers?.find(c => c.id === customerId) && userId) {
      customersStore.fetchCustomers(userId, { limit: 100 });
    }
    // integrate with app: call onClose to close this and open CustomerSheetView or trigger route
    onClose?.();
    // parent should display Customer sheet.
  };

  const openDeleteConfirmation = (type, id, name) => {
    // delegate to stores: or raise event; for simplicity call delete and close
    if (type === "order" && userId) {
      ordersStore.deleteOrder(userId, id).then(res => {
        if (res?.success) onClose?.();
      }).catch(e => console.error(e));
    }
  };

  const deleteMeasurement = (measurementId) => {
    if (!userId || !activeCustomerId) return;
    measurementsStore.deleteMeasurement(userId, activeCustomerId, measurementId).then(res => {
      if (res?.success) {
        // Refresh measurements list
        measurementsStore.fetchMeasurementsOfCustomer(userId, activeCustomerId).catch(()=>{});
      }
    }).catch(e => console.error(e));
  };

  const createMeasurement = async (payload) => {
    if (activeCustomerId && userId) {
      await measurementsStore.addMeasurement(userId, activeCustomerId, payload);
    } else {
      console.error("No customer ID or user ID found for creating measurement");
    }
  };

  const updateMeasurement = async (measurementId, payload) => {
    if (activeCustomerId && userId) {
      await measurementsStore.updateMeasurement(userId, activeCustomerId, measurementId, payload);
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
