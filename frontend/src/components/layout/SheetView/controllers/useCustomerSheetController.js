import { useEffect, useState } from "react";
import { useCustomersStore } from "@/store/useCustomersStore";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useMeasurementsStore } from "@/store/useMeasurementsStore";
import { useAuthContext } from "@/components/AuthProvider";
import { ORDER_STATUSES } from "../orderConstants.js";

export default function useCustomerSheetController({ customer, onClose }) {
  const customersStore = useCustomersStore();
  const ordersStore = useOrdersStore();
  const measurementsStore = useMeasurementsStore();
  const { userId } = useAuthContext();

  const [localCustomer, setLocalCustomer] = useState(customer || null);
  const [customerForm, setCustomerForm] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    notes: customer?.notes || "",
  });

  const [orderForm, setOrderForm] = useState({
    type: "",
    quantity: 1,
    status: ORDER_STATUSES.NEW,
    notes: "",
  });

  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [editing, setEditing] = useState({ customer: false, measurement: false });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalCustomer(customer);
    setCustomerForm({
      name: customer?.name || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
      notes: customer?.notes || "",
    });

    if (customer?.id && userId) {
      setLoadingOrders(true);
      ordersStore.fetchOrdersOfCustomer(userId, customer.id).then(res => {
        if (res?.data) setCustomerOrders(res.data);
      }).finally(() => setLoadingOrders(false));

      measurementsStore.fetchMeasurementsOfCustomer(userId, customer.id).catch(()=>{});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer, userId]);

  const handleSaveAll = async () => {
    if (!userId) return;
    setIsSaving(true);
    try {
      if (!localCustomer?.id) {
        const r = await customersStore.addCustomer(userId, customerForm);
        if (r?.success) {
          setLocalCustomer(r.data);
          setCustomerForm({
            name: r.data?.name || "",
            phone: r.data?.phone || "",
            email: r.data?.email || "",
            notes: r.data?.notes || "",
          });
          setEditing({ customer: false, measurement: editing.measurement });
          onClose?.();
        }
      } else {
        const r = await customersStore.updateCustomer(userId, localCustomer.id, customerForm);
        if (r?.success) {
          setLocalCustomer(r.data);
          setCustomerForm({
            name: r.data?.name || "",
            phone: r.data?.phone || "",
            email: r.data?.email || "",
            notes: r.data?.notes || "",
          });
          setEditing({ customer: false, measurement: editing.measurement });
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAll = () => {
    setCustomerForm({
      name: localCustomer?.name || "",
      phone: localCustomer?.phone || "",
      email: localCustomer?.email || "",
      notes: localCustomer?.notes || "",
    });
    setEditing({ customer: false, measurement: false });
  };

  const openDeleteConfirmation = (type, id, name) => {
    // simple immediate delete (replace with modal flow if you have UI)
    if (type === "customer" && userId) {
      customersStore.deleteCustomer(userId, id).then(res => {
        if (res?.success) onClose?.();
      }).catch(e => console.error(e));
    }
  };

  const deleteOrder = (orderId) => {
    if (!userId) return;
    ordersStore.deleteOrder(userId, orderId).then(res => {
      if (res?.success) {
        // Refresh orders list
        if (customer?.id) {
          ordersStore.fetchOrdersOfCustomer(userId, customer.id).then(r => {
            if (r?.data) setCustomerOrders(r.data);
          });
        }
      }
    }).catch(e => console.error(e));
  };

  const prepareCreateOrder = () => {
    setOrderForm({
      type: "",
      quantity: 1,
      status: ORDER_STATUSES.NEW,
      notes: "",
    });
  };

  const prepareEditOrder = (order) => {
    setOrderForm({
      type: order.type || "",
      quantity: order.quantity || 1,
      status: order.status || ORDER_STATUSES.IN_PROGRESS,
      notes: order.notes || "",
    });
  };

  const createOrder = async () => {
    if (!localCustomer?.id || !userId) return false;
    setIsSaving(true);
    try {
      const res = await ordersStore.addOrder(userId, localCustomer.id, orderForm);
      if (res?.success) {
        const r = await ordersStore.fetchOrdersOfCustomer(userId, localCustomer.id);
        if (r?.data) setCustomerOrders(r.data);
        return true;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
    return false;
  };

  const updateOrder = async (orderId) => {
    if (!userId) return false;
    setIsSaving(true);
    try {
      const res = await ordersStore.updateOrder(userId, orderId, orderForm);
      if (res?.success) {
        const r = await ordersStore.fetchOrdersOfCustomer(userId, localCustomer.id);
        if (r?.data) setCustomerOrders(r.data);
        return true;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
    return false;
  };

  const deleteMeasurement = (measurementId) => {
    if (!userId || !customer?.id) return;
    measurementsStore.deleteMeasurement(userId, customer.id, measurementId).then(res => {
      if (res?.success) {
        // Refresh measurements list
        measurementsStore.fetchMeasurementsOfCustomer(userId, customer.id).catch(()=>{});
      }
    }).catch(e => console.error(e));
  };

  const createMeasurement = async (payload) => {
    if (customer?.id && userId) {
      await measurementsStore.addMeasurement(userId, customer.id, payload);
    }
  };

  const updateMeasurement = async (measurementId, payload) => {
    if (customer?.id && userId) {
      await measurementsStore.updateMeasurement(userId, customer.id, measurementId, payload);
    }
  };

  return {
    state: {
      localCustomer,
      customerForm,
      customerOrders,
      loadingOrders,
      editing,
      orderForm,
    },
    handlers: {
      setEditing: (payload) => setEditing(prev => ({ ...prev, ...payload })),
      handleSaveAll,
      handleCancelAll,
      openDeleteConfirmation,
      deleteOrder,
      deleteMeasurement,
      setCustomerForm: (payload) => setCustomerForm(prev => ({ ...prev, ...payload })),
      setOrderForm: (payload) => setOrderForm(prev => ({ ...prev, ...payload })),
      prepareCreateOrder,
      prepareEditOrder,
      createOrder,
      updateOrder,
      createMeasurement,
      updateMeasurement,
    },
    customersStore,
    ordersStore,
    measurementsStore,
    isSaving,
    isAnyEditing: editing.customer || editing.measurement,
    displayName: localCustomer?.name || "Customer",
  };
}