import { useEffect, useState } from "react";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useCustomersStore } from "@/store/useCustomersStore";
import { useMeasurementsStore } from "@/store/useMeasurementsStore";
import { useAuthContext } from "@/components/AuthProvider";
import { ORDER_STATUSES } from "../orderConstants.js";

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
    status: order?.status || ORDER_STATUSES.NEW,
    notes: order?.notes || "",
    tag: order?.tag ?? defaultTag,
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
      status: order?.status || ORDER_STATUSES.NEW,
      notes: order?.notes || "",
      tag: order?.tag ?? defaultTag,
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
        const res = await ordersStore.updateOrder(userId, stateOrder.id, orderForm);
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
      status: stateOrder?.status || ORDER_STATUSES.NEW,
      notes: stateOrder?.notes || "",
      tag: stateOrder?.tag ?? defaultTag,
    });
    setEditing({ order: false, measurement: false });
  };

  const openCustomerSheet = (customerId) => {
    if (!customersStore.customers?.find(c => c.id === customerId) && userId) {
      customersStore.fetchCustomers(userId, { limit: 100 });
    }
    onClose?.();
  };

  const openDeleteConfirmation = (type, id, name) => {
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