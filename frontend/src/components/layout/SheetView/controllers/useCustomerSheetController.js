import { useEffect, useState } from "react";
import { useCustomersStore } from "@/store/useCustomersStore";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useMeasurementsStore } from "@/store/useMeasurementsStore";
import { create } from "zustand";

export default function useCustomerSheetController({ customer, onClose }) {
  const customersStore = useCustomersStore();
  const ordersStore = useOrdersStore();
  const measurementsStore = useMeasurementsStore();

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
    status: "",
    notes: "",
    due_date: "",
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

    if (customer?.id) {
      setLoadingOrders(true);
      ordersStore.fetchOrdersOfCustomer(customer.id).then(res => {
        if (res?.data) setCustomerOrders(res.data);
      }).finally(() => setLoadingOrders(false));

      measurementsStore.fetchMeasurementsOfCustomer(customer.id).catch(()=>{});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customer]);

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      if (!localCustomer?.id) {
        const r = await customersStore.addCustomer(customerForm);
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
        const r = await customersStore.updateCustomer(localCustomer.id, customerForm);
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
    if (type === "customer") {
      customersStore.deleteCustomer(id).then(res => {
        if (res?.success) onClose?.();
      }).catch(e => console.error(e));
    }
  };

  const deleteOrder = (orderId) => {
    ordersStore.deleteOrder(orderId).then(res => {
      if (res?.success) {
        // Refresh orders list
        if (customer?.id) {
          ordersStore.fetchOrdersOfCustomer(customer.id).then(r => {
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
      status: "",
      notes: "",
      due_date: "",
    });
  };

  const prepareEditOrder = (order) => {
    setOrderForm({
      type: order.type || "",
      quantity: order.quantity || 1,
      status: order.status || "",
      notes: order.notes || "",
      due_date: order.due_date ? order.due_date.split("T")[0] : "",
    });
  };

  const createOrder = async () => {
    if (!localCustomer?.id) return false;
    setIsSaving(true);
    try {
      const res = await ordersStore.addOrder(localCustomer.id, orderForm);
      if (res?.success) {
        const r = await ordersStore.fetchOrdersOfCustomer(localCustomer.id);
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
    setIsSaving(true);
    try {
      const res = await ordersStore.updateOrders(orderId, orderForm);
      if (res?.success) {
        const r = await ordersStore.fetchOrdersOfCustomer(localCustomer.id);
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
    measurementsStore.deleteMeasurement(measurementId).then(res => {
      if (res?.success) {
        // Refresh measurements list
        if (customer?.id) {
          measurementsStore.fetchMeasurementsOfCustomer(customer.id).catch(()=>{});
        }
      }
    }).catch(e => console.error(e));
  };

  const createMeasurement = async (payload) => {
    if (customer?.id) {
      await measurementsStore.addMeasurement(customer.id, payload);
    }
  };

  const updateMeasurement = async (measurementId, payload) => {
    if (customer?.id) {
      await measurementsStore.updateMeasurement(customer.id, measurementId, payload);
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
