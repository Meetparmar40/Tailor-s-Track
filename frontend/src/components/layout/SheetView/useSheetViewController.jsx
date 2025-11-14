import { useCallback, useEffect, useReducer } from "react";
import { measurementTemplates } from "./constants";
import {useOrdersStore} from "@/store/useOrdersStore";
import {useCustomersStore} from "@/store/useCustomersStore";
import {useMeasurementsStore} from "@/store/useMeasurementsStore";

const initialState = (props) => ({
  // contexts
  mode: props.mode || "view",
  defaultTag: props.defaultTag || 0,

  // domain contexts
  localOrder: props.order || null,
  localCustomer: props.customer || null,

  // lists from stores (mirrored for local usage)
  customerOrders: [],

  // loading flags
  loadingOrders: false,
  loadingMeasurements: false,
  isSaving: false,
  isSavingTag: false,

  // editing flags
  editing: {
    tag: false,
    customer: props.mode === "createOrder" || props.mode === "createCustomer",
    order: props.mode === "createOrder",
    measurement: false,
  },

  // creating flags
  creating: {
    newMeasurement: false,
    newOrder: false,
  },

  // forms
  selectedTag: (props.order && props.order.tag) || props.defaultTag || 0,
  selectedCustomerId: null,
  customerForm: {
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: "",
  },
  orderForm: {
    type: "",
    quantity: 1,
    status: "",
    notes: "",
    tag: props.defaultTag || 0,
    due_date: "",
  },
  orderCardForms: {}, // keyed by order id for inline editing
  measurementForm: {
    type: "",
    data: {},
  },

  // customer list search/ui
  openCustomerCombo: false,
  customerSearch: "",

  // delete modal state
  deleteConfirmation: {
    open: false,
    type: null,
    id: null,
    title: "",
    description: "",
  },
});

function reducer(state, action) {
  switch (action.type) {
    case "INIT_STORE_DATA":
      return { ...state, ...action.payload };
    case "SET":
      return { ...state, ...action.payload };
    case "SET_EDITING":
      return { ...state, editing: { ...state.editing, ...action.payload } };
    case "SET_CREATING":
      return { ...state, creating: { ...state.creating, ...action.payload } };
    case "SET_CUSTOMER_FORM":
      return { ...state, customerForm: { ...state.customerForm, ...action.payload } };
    case "SET_ORDER_FORM":
      return { ...state, orderForm: { ...state.orderForm, ...action.payload } };
    case "SET_ORDER_CARD_FORM":
      return { ...state, orderCardForms: { ...state.orderCardForms, ...action.payload } };
    case "SET_MEASUREMENT_FORM":
      return { ...state, measurementForm: { ...state.measurementForm, ...action.payload } };
    case "SET_DELETE_CONFIRMATION":
      return { ...state, deleteConfirmation: { ...state.deleteConfirmation, ...action.payload } };
    case "RESET_FORMS_TO_ORDER":
      return {
        ...state,
        customerForm: action.payload.customerForm,
        orderForm: action.payload.orderForm,
        editing: { ...state.editing, customer: false, order: false, measurement: false },
        creating: { newMeasurement: false, newOrder: false },
      };
    default:
      return state;
  }
}

/* -------------------------
   Hook
   ------------------------- */
export default function useSheetViewController(props) {
  const [state, dispatch] = useReducer(reducer, null, () => initialState(props));

  // stores
  const ordersStore = useOrdersStore();
  const customersStore = useCustomersStore();
  const measurementsStore = useMeasurementsStore();

  const setState = (payload) => dispatch({ type: "SET", payload });
  const setEditing = (payload) => dispatch({ type: "SET_EDITING", payload });
  const setCreating = (payload) => dispatch({ type: "SET_CREATING", payload });
  const setCustomerForm = (payload) => dispatch({ type: "SET_CUSTOMER_FORM", payload });
  const setOrderForm = (payload) => dispatch({ type: "SET_ORDER_FORM", payload });
  const setOrderCardForm = (payload) => dispatch({ type: "SET_ORDER_CARD_FORM", payload });
  const setMeasurementForm = (payload) => dispatch({ type: "SET_MEASUREMENT_FORM", payload });
  const setDeleteConfirmation = (payload) => dispatch({ type: "SET_DELETE_CONFIRMATION", payload });

  /* -------------------------
     Initialization effect
     ------------------------- */
  useEffect(() => {
    // keep a local mirror of initial order/customer into forms
    if (props.mode === "createOrder") {
      setState({
        localOrder: null,
        localCustomer: null,
        selectedTag: props.defaultTag || 0,
      });
      dispatch({
        type: "SET_CUSTOMER_FORM",
        payload: { name: "", phone: "", email: "", address: "", notes: "" },
      });
      dispatch({
        type: "SET_ORDER_FORM",
        payload: { type: "", quantity: 1, status: "", notes: "", tag: props.defaultTag || 0, due_date: "" },
      });
      if ((customersStore.customers || []).length === 0) {
        customersStore.fetchCustomers({ limit: 100 }).catch(() => {});
      }
      return;
    }

    if (props.mode === "createCustomer") {
      setState({ localOrder: null, localCustomer: null });
      dispatch({
        type: "SET_CUSTOMER_FORM",
        payload: { name: "", phone: "", email: "", address: "", notes: "" },
      });
      return;
    }

    if (props.order) {
      const o = props.order;
      setState({ localOrder: o, localCustomer: null, selectedTag: o.tag });
      dispatch({
        type: "SET_CUSTOMER_FORM",
        payload: {
          name: o.customer_name || "",
          phone: o.phone || "",
          email: o.email || "",
          address: o.address || "",
          notes: o.notes || "",
        },
      });
      dispatch({
        type: "SET_ORDER_FORM",
        payload: {
          type: o.type || "",
          quantity: o.quantity || 1,
          notes: o.order_notes || "",
          status: o.status || "",
          tag: o.tag,
          due_date: o.due_date ? o.due_date.split("T")[0] : "",
        },
      });

      if ((customersStore.customers || []).length === 0) {
        customersStore.fetchCustomers({ limit: 100 }).catch(() => {});
      }

      if (o.customer_id) {
        setState({ loadingMeasurements: true });
        measurementsStore.fetchMeasurementsOfCustomer(o.customer_id).finally(() => {
          setState({ loadingMeasurements: false });
        });
      }
      return;
    }

    if (props.customer) {
      const c = props.customer;
      setState({ localCustomer: c, localOrder: null });
      dispatch({
        type: "SET_CUSTOMER_FORM",
        payload: {
          name: c.name || "",
          phone: c.phone || "",
          email: c.email || "",
          address: c.address || "",
          notes: c.notes || "",
        },
      });

      if (c.id) {
        setState({ loadingOrders: true, loadingMeasurements: true });
        ordersStore.fetchOrdersOfCustomer(c.id).then((res) => {
          if (res?.data) {
            setState({ customerOrders: res.data });
          }
        }).finally(() => setState({ loadingOrders: false }));

        measurementsStore.fetchMeasurementsOfCustomer(c.id).finally(() => setState({ loadingMeasurements: false }));
      }
      return;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.order, props.customer, props.mode]);

  /* -------------------------
     Measurement form sync
     ------------------------- */
  useEffect(() => {
    const allMeasurements = measurementsStore.measurements || [];
    if (allMeasurements.length > 0) {
      const match = allMeasurements.find((m) => m.type === state.orderForm.type);
      if (match) {
        setMeasurementForm({ type: match.type, data: match.data || {} });
      } else if (state.orderForm.type) {
        setMeasurementForm({ type: state.orderForm.type, data: measurementTemplates[state.orderForm.type] || {} });
      }
    } else if (state.orderForm.type) {
      setMeasurementForm({ type: state.orderForm.type, data: measurementTemplates[state.orderForm.type] || {} });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measurementsStore.measurements, state.orderForm.type]);

  /* -------------------------
     Handlers
     ------------------------- */
  const handleTagChange = useCallback(async (value) => {
    const newTag = parseInt(value, 10);
    setState({ selectedTag: newTag });
    if (state.localOrder?.id) {
      dispatch({ type: "SET", payload: { isSavingTag: true } });
      try {
        const r = await ordersStore.updateOrders(state.localOrder.id, { tag: newTag });
        if (r?.success) {
          setState({ localOrder: { ...state.localOrder, tag: newTag }, selectedTag: newTag });
          setEditing({ tag: false });
        } else {
          setState({ selectedTag: state.localOrder.tag });
        }
      } catch (e) {
        setState({ selectedTag: state.localOrder.tag });
      } finally {
        dispatch({ type: "SET", payload: { isSavingTag: false } });
      }
    } else {
      setOrderForm({ tag: newTag });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.localOrder]);

  const handleCustomerSelect = useCallback(async (customerId) => {
    const selected = (customersStore.customers || []).find((c) => c.id === customerId);
    if (selected) {
      setState({ selectedCustomerId: customerId });
      setCustomerForm({
        name: selected.name || "",
        phone: selected.phone || "",
        email: selected.email || "",
        address: selected.address || "",
        notes: selected.notes || "",
      });

      if (state.mode === "createOrder") {
        setState({ loadingMeasurements: true });
        measurementsStore.fetchMeasurementsOfCustomer(customerId).finally(() => setState({ loadingMeasurements: false }));
      }
    }
    setState({ openCustomerCombo: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customersStore.customers, state.mode]);

  const handleCustomerInputChange = useCallback((field, value) => {
    setCustomerForm({ [field]: value });
  }, []);

  const handleOrderInputChange = useCallback((field, value) => {
    setOrderForm({ [field]: value });
  }, []);

  const handleOrderCardInputChange = useCallback((orderId, field, value) => {
    const prev = state.orderCardForms || {};
    setOrderCardForm({
      ...prev,
      [orderId]: { ...(prev[orderId] || {}), [field]: value },
    });
  }, [state.orderCardForms]);

  const handleMeasurementInputChange = useCallback((field, value) => {
    if (field === "type") {
      setMeasurementForm({ type: value, data: measurementTemplates[value] || {} });
    } else {
      setMeasurementForm({ data: { ...state.measurementForm.data, [field]: value } });
    }
  }, [state.measurementForm]);

  const handleEditOrderCard = useCallback((order) => {
    setOrderCardForm({
      [order.id]: {
        type: order.type,
        quantity: order.quantity,
        notes: order.order_notes || "",
        status: order.status,
        tag: order.tag,
        due_date: order.due_date ? order.due_date.split("T")[0] : "",
      },
    });
    setState({ editingOrderId: order.id });
  }, []);

  const handleSaveOrderCard = useCallback(async (orderId) => {
    try {
      const formData = (state.orderCardForms || {})[orderId] || {};
      const result = await ordersStore.updateOrders(orderId, formData);
      if (result?.success) {
        const newOrders = (state.customerOrders || []).map((o) => (o.id === orderId ? { ...o, ...result.data } : o));
        setState({ customerOrders: newOrders });
        setOrderCardForm({ [orderId]: undefined });
        setState({ editingOrderId: null });
      }
    } catch (e) {
      console.error("Error updating order", e);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.orderCardForms, state.customerOrders]);

  const handleCancelOrderCard = useCallback((orderId) => {
    const copy = { ...(state.orderCardForms || {}) };
    delete copy[orderId];
    setOrderCardForm(copy);
    setState({ editingOrderId: null });
  }, [state.orderCardForms]);

  const handleSaveAll = useCallback(async () => {
    dispatch({ type: "SET", payload: { isSaving: true } });
    try {
      let customerId = state.selectedCustomerId;

      // create or update customer when in create modes or editing customer
      if (state.mode === "createOrder" || state.mode === "createCustomer" || state.editing.customer) {
        if (!customerId) {
          const customerResult = await customersStore.addCustomer(state.customerForm);
          if (customerResult?.success) {
            customerId = customerResult.data.id;
            setState({ selectedCustomerId: customerId });
          } else {
            console.error("Failed to create customer:", customerResult?.error);
            return;
          }
        } else {
          const updateResult = await customersStore.updateCustomer(customerId, state.customerForm);
          if (!updateResult?.success) {
            console.error("Failed to update customer:", updateResult?.error);
          }
        }
      } else if (state.localCustomer?.id) {
        const updateResult = await customersStore.updateCustomer(state.localCustomer.id, state.customerForm);
        if (updateResult?.success) setState({ localCustomer: { ...state.localCustomer, ...updateResult.data } });
        customerId = state.localCustomer.id;
      } else if (state.localOrder?.customer_id) {
        await customersStore.updateCustomer(state.localOrder.customer_id, state.customerForm);
        customerId = state.localOrder.customer_id;
      }

      // create or update order
      if (state.mode === "createOrder" && customerId) {
        const orderResult = await ordersStore.addOrder(customerId, state.orderForm);
        if (orderResult?.success) {
          setState({ localOrder: orderResult.data });
          setEditing({ order: false });
        }
      } else if (state.localOrder?.id) {
        const orderResult = await ordersStore.updateOrders(state.localOrder.id, state.orderForm);
        if (orderResult?.success) {
          setState({ localOrder: orderResult.data });
          setEditing({ order: false });
        }
      }

      // measurement create/update
      if (state.editing.measurement && state.measurementForm.type && customerId) {
        const existing = (measurementsStore.measurements || []).find((m) => m.type === state.measurementForm.type);
        if (existing) {
          const measurementResult = await measurementsStore.updateMeasurement(customerId, existing.id, state.measurementForm);
          if (measurementResult?.success) setEditing({ measurement: false });
        } else {
          const measurementResult = await measurementsStore.addMeasurement(customerId, state.measurementForm);
          if (measurementResult?.success) setEditing({ measurement: false });
        }
      }

      setEditing({ customer: false });
      if (state.mode === "createOrder" || state.mode === "createCustomer") {
        props.onClose?.();
      }
    } catch (e) {
      console.error("Save failed", e);
    } finally {
      dispatch({ type: "SET", payload: { isSaving: false } });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleCancelAll = useCallback(() => {
    if (state.mode === "createOrder" || state.mode === "createCustomer") {
      props.onClose?.();
      return;
    }
    if (state.localOrder) {
      const o = state.localOrder;
      dispatch({
        type: "RESET_FORMS_TO_ORDER",
        payload: {
          customerForm: {
            name: o.customer_name || "",
            phone: o.phone || "",
            email: o.email || "",
            address: o.address || "",
            notes: o.notes || "",
          },
          orderForm: {
            type: o.type || "",
            quantity: o.quantity || 1,
            notes: o.order_notes || "",
            status: o.status || "",
            tag: o.tag,
            due_date: o.due_date ? o.due_date.split("T")[0] : "",
          },
        },
      });
      return;
    }
    if (state.localCustomer) {
      const c = state.localCustomer;
      dispatch({
        type: "RESET_FORMS_TO_ORDER",
        payload: {
          customerForm: {
            name: c.name || "",
            phone: c.phone || "",
            email: c.email || "",
            address: c.address || "",
            notes: c.notes || "",
          },
          orderForm: state.orderForm,
        },
      });
      return;
    }
    // fallback: clear editing flags
    setEditing({ customer: false, order: false, measurement: false });
    setCreating({ newMeasurement: false, newOrder: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.localOrder, state.localCustomer]);

  const openDeleteConfirmation = useCallback((type, id, itemName) => {
    let title = "";
    let description = "";
    switch (type) {
      case "order":
        title = "Delete Order";
        description = `Are you sure you want to delete this order for ${itemName}? This action cannot be undone.`;
        break;
      case "customer":
        title = "Delete Customer";
        description = `Are you sure you want to delete ${itemName}? This will also delete all their orders and measurements. This action cannot be undone.`;
        break;
      case "measurement":
        title = "Delete Measurement";
        description = `Are you sure you want to delete this ${itemName} measurement? This action cannot be undone.`;
        break;
      case "removeCustomer":
        title = "Remove Customer from Order";
        description = `Are you sure you want to remove ${itemName} from this order? The customer and their data will remain, but this order will be unlinked.`;
        break;
      default:
        return;
    }

    setDeleteConfirmation({ open: true, type, id, title, description });
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    const { type, id } = state.deleteConfirmation;
    try {
      switch (type) {
        case "order": {
          const r = await ordersStore.deleteOrder(id);
          if (r?.success) {
            if (state.localCustomer?.id) {
              const filtered = (state.customerOrders || []).filter((o) => o.id !== id);
              setState({ customerOrders: filtered });
            } else {
              props.onClose?.();
            }
          }
          break;
        }
        case "customer": {
          const r = await customersStore.deleteCustomer(id);
          if (r?.success) props.onClose?.();
          break;
        }
        case "measurement": {
          const custId = state.localCustomer?.id || state.localOrder?.customer_id;
          if (custId) {
            const r = await measurementsStore.deleteMeasurement(custId, id);
            if (r?.success) {
              // store should update automatically
            }
          }
          break;
        }
        case "removeCustomer": {
          const r = await ordersStore.updateOrders(state.localOrder.id, {
            customer_id: null,
            customer_name: "",
            phone: "",
            email: "",
            address: "",
          });
          if (r?.success) {
            setState({ localOrder: r.data });
            setState({ selectedCustomerId: null });
            setCustomerForm({ name: "", phone: "", email: "", address: "", notes: "" });
          }
          break;
        }
        default:
          break;
      }
    } catch (e) {
      console.error("Delete error", e);
    } finally {
      setDeleteConfirmation({ open: false, type: null, id: null, title: "", description: "" });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.deleteConfirmation, state.localOrder, state.localCustomer, state.customerOrders]);

  /* -------------------------
     Expose controller API
     ------------------------- */
  const handlers = {
    // UI setters
    setEditingTag: (val) => setEditing({ tag: val }),
    setEditing: (payload) => setEditing(payload),

    // small setters
    setOpenCustomerCombo: (val) => setState({ openCustomerCombo: val }),
    setCustomerSearch: (val) => setState({ customerSearch: val }),

    // form handlers
    handleTagChange,
    handleCustomerSelect,
    handleCustomerInputChange,
    handleOrderInputChange,
    handleOrderCardInputChange,
    handleMeasurementInputChange,
    handleEditOrderCard,
    handleSaveOrderCard,
    handleCancelOrderCard,

    // main actions
    handleSaveAll,
    handleCancelAll,

    // delete actions
    openDeleteConfirmation,
    setDeleteConfirmation,
    handleConfirmDelete,
  };

  const computed = {
    isAnyEditing:
      state.editing.customer ||
      state.editing.order ||
      state.editing.measurement ||
      state.creating.newMeasurement ||
      state.creating.newOrder,
    isOrderContext: !!state.localOrder,
    isCustomerContext: !!state.localCustomer,
    isCreating: state.mode === "createOrder" || state.mode === "createCustomer",
    displayName: state.mode === "createOrder" || state.mode === "createCustomer"
      ? state.mode === "createOrder"
        ? "Create New Order"
        : "Create New Customer"
      : (state.localOrder ? state.localOrder.customer_name : (state.localCustomer?.name || "")),
  };

  return {
    state,
    handlers,
    ordersStore,
    customersStore,
    measurementsStore,
    isAnyEditing: computed.isAnyEditing,
    isOrderContext: computed.isOrderContext,
    isCustomerContext: computed.isCustomerContext,
    isCreating: computed.isCreating,
    displayName: computed.displayName,
    selectedTag: state.selectedTag,
    isSavingTag: state.isSavingTag,
    isSaving: state.isSaving,
  };
}
