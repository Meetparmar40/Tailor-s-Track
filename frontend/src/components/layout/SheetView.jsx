import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner.jsx";
import { Save, X } from "lucide-react";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useCustomersStore } from "@/store/useCustomersStore";
import { useMeasurementsStore } from "@/store/useMeasurementsStore";

// Import sub-components
import SheetViewHeader from "./SheetView/SheetViewHeader";
import CustomerInformationCard from "./SheetView/CustomerInformationCard";
import OrderInformationCard from "./SheetView/OrderInformationCard";
import OrdersTabContent from "./SheetView/OrdersTabContent";
import MeasurementsTabContent from "./SheetView/MeasurementsTabContent";
import DeleteConfirmationDialog from "./SheetView/DeleteConfirmationDialog";
import { measurementTemplates } from "./SheetView/constants";

export default function SheetView({ 
  order, 
  customer, 
  open, 
  onOpenChange, 
  mode = "view", // "view", "createOrder", "createCustomer"
  defaultTag = 0 
}) {
  const { 
    updateOrders, 
    fetchOrdersOfCustomer, 
    addOrder, 
    deleteOrder,
    updateOrderTag 
  } = useOrdersStore();
  const { 
    customers, 
    fetchCustomers, 
    updateCustomer, 
    addCustomer,
    deleteCustomer 
  } = useCustomersStore();
  const { 
    measurements, 
    fetchMeasurementsOfCustomer, 
    updateMeasurement, 
    addMeasurement,
    deleteMeasurement 
  } = useMeasurementsStore();
  
  // Local state
  const [localOrder, setLocalOrder] = useState(order);
  const [localCustomer, setLocalCustomer] = useState(customer);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingMeasurements, setLoadingMeasurements] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingTag, setIsSavingTag] = useState(false);
  
  // Edit states
  const [isEditingTag, setIsEditingTag] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(mode === "createOrder" || mode === "createCustomer");
  const [isEditingOrder, setIsEditingOrder] = useState(mode === "createOrder");
  const [isEditingMeasurement, setIsEditingMeasurement] = useState(false);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [creatingNewMeasurement, setCreatingNewMeasurement] = useState(false);
  const [creatingNewOrder, setCreatingNewOrder] = useState(false);
  
  // Form data
  const [selectedTag, setSelectedTag] = useState(order?.tag || defaultTag);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [customerFormData, setCustomerFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    notes: ""
  });
  const [orderFormData, setOrderFormData] = useState({
    type: "",
    quantity: 1,
    status: "",
    notes: "",
    tag: defaultTag,
    due_date: ""
  });
  const [orderCardFormData, setOrderCardFormData] = useState({});
  const [measurementFormData, setMeasurementFormData] = useState({
    type: "",
    data: {}
  });
  
  // Customer search
  const [openCustomerCombo, setOpenCustomerCombo] = useState(false);
  const [customerSearch, setCustomerSearch] = useState("");
  
  // Delete confirmation dialogs
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    open: false,
    type: null,
    id: null,
    title: "",
    description: ""
  });

  // Initialize data based on mode and props
  useEffect(() => {
    if (mode === "createOrder") {
      setLocalOrder(null);
      setLocalCustomer(null);
      setSelectedTag(defaultTag);
      setOrderFormData({
        type: "",
        quantity: 1,
        status: "",
        notes: "",
        tag: defaultTag,
        due_date: ""
      });
      setCustomerFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: ""
      });
      if (customers.length === 0) {
        fetchCustomers({ limit: 100 });
      }
    } else if (mode === "createCustomer") {
      setLocalOrder(null);
      setLocalCustomer(null);
      setCustomerFormData({
        name: "",
        phone: "",
        email: "",
        address: "",
        notes: ""
      });
    } else if (order) {
      setLocalOrder(order);
      setLocalCustomer(null);
      setSelectedTag(order.tag);
      setCustomerFormData({
        name: order.customer_name || "",
        phone: order.phone || "",
        email: order.email || "",
        address: order.address || "",
        notes: order.notes || ""
      });
      setOrderFormData({
        type: order.type,
        quantity: order.quantity,
        notes: order.order_notes,
        status: order.status,
        tag: order.tag,
        due_date: order.due_date ? order.due_date.split('T')[0] : ""
      });
      
      if (customers.length === 0) {
        fetchCustomers({ limit: 100 });
      }
      
      if (order.customer_id) {
        setLoadingMeasurements(true);
        fetchMeasurementsOfCustomer(order.customer_id).finally(() => {
          setLoadingMeasurements(false);
        });
      }
    } else if (customer) {
      setLocalCustomer(customer);
      setLocalOrder(null);
      setCustomerFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        notes: customer.notes || ""
      });
      
      if (customer.id) {
        setLoadingOrders(true);
        setLoadingMeasurements(true);
        
        fetchOrdersOfCustomer(customer.id).then((result) => {
          if (result?.data) {
            setCustomerOrders(result.data);
          }
        }).finally(() => {
          setLoadingOrders(false);
        });
        
        fetchMeasurementsOfCustomer(customer.id).finally(() => {
          setLoadingMeasurements(false);
        });
      }
    }
  }, [order, customer, mode, defaultTag, fetchCustomers, fetchOrdersOfCustomer, fetchMeasurementsOfCustomer, customers.length]);

  // Update measurement form when order type changes or measurements load
  useEffect(() => {
    if (measurements && measurements.length > 0) {
      const matchingMeasurement = measurements.find(m => m.type === orderFormData.type);
      if (matchingMeasurement) {
        setMeasurementFormData({
          type: matchingMeasurement.type,
          data: matchingMeasurement.data || {}
        });
      } else {
        setMeasurementFormData({
          type: orderFormData.type,
          data: measurementTemplates[orderFormData.type] || {}
        });
      }
    } else if (orderFormData.type) {
      setMeasurementFormData({
        type: orderFormData.type,
        data: measurementTemplates[orderFormData.type] || {}
      });
    }
  }, [measurements, orderFormData.type]);

  const handleSaveTag = async (newTag = selectedTag) => {
    if (!localOrder?.id) return;
    
    setIsSavingTag(true);
    try {
      const result = await updateOrders(localOrder.id, { tag: newTag });
      if (result.success) {
        setLocalOrder(prev => ({ ...prev, tag: newTag }));
        setSelectedTag(newTag);
        setIsEditingTag(false);
      }
    } catch (error) {
      console.error("Error saving tag:", error);
      setSelectedTag(localOrder.tag);
    } finally {
      setIsSavingTag(false);
    }
  };

  const handleTagChange = async (value) => {
    const newTag = parseInt(value);
    setSelectedTag(newTag);
    if (localOrder?.id) {
      await handleSaveTag(newTag);
    } else {
      setOrderFormData(prev => ({ ...prev, tag: newTag }));
    }
  };

  const handleCustomerSelect = async (customerId) => {
    const selectedCustomer = customers.find(c => c.id === customerId);
    if (selectedCustomer) {
      setSelectedCustomerId(customerId);
      setCustomerFormData({
        name: selectedCustomer.name || "",
        phone: selectedCustomer.phone || "",
        email: selectedCustomer.email || "",
        address: selectedCustomer.address || "",
        notes: selectedCustomer.notes || ""
      });
      
      if (mode === "createOrder") {
        setLoadingMeasurements(true);
        fetchMeasurementsOfCustomer(customerId).finally(() => {
          setLoadingMeasurements(false);
        });
      }
    }
    setOpenCustomerCombo(false);
  };

  const handleCustomerInputChange = (field, value) => {
    setCustomerFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOrderInputChange = (field, value) => {
    setOrderFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOrderCardInputChange = (orderId, field, value) => {
    setOrderCardFormData(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [field]: value
      }
    }));
  };

  const handleMeasurementInputChange = (field, value) => {
    if (field === "type") {
      setMeasurementFormData({
        type: value,
        data: measurementTemplates[value] || {}
      });
    } else {
      setMeasurementFormData(prev => ({
        ...prev,
        data: {
          ...prev.data,
          [field]: value
        }
      }));
    }
  };

  const handleEditOrderCard = (order) => {
    setEditingOrderId(order.id);
    setOrderCardFormData(prev => ({
      ...prev,
      [order.id]: {
        type: order.type,
        quantity: order.quantity,
        notes: order.order_notes || "",
        status: order.status,
        tag: order.tag,
        due_date: order.due_date ? order.due_date.split('T')[0] : ""
      }
    }));
  };

  const handleSaveOrderCard = async (orderId) => {
    try {
      const formData = orderCardFormData[orderId];
      const result = await updateOrders(orderId, formData);
      if (result?.success) {
        setCustomerOrders(prev => 
          prev.map(o => o.id === orderId ? { ...o, ...result.data } : o)
        );
        setEditingOrderId(null);
        setOrderCardFormData(prev => {
          const newData = { ...prev };
          delete newData[orderId];
          return newData;
        });
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleCancelOrderCard = (orderId) => {
    setEditingOrderId(null);
    setOrderCardFormData(prev => {
      const newData = { ...prev };
      delete newData[orderId];
      return newData;
    });
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      let customerId = selectedCustomerId;
      
      if (mode === "createOrder" || mode === "createCustomer") {
        if (!selectedCustomerId) {
          const customerResult = await addCustomer(customerFormData);
          if (customerResult.success) {
            customerId = customerResult.data.id;
            setSelectedCustomerId(customerId);
          } else {
            console.error("Failed to create customer:", customerResult.error);
            return;
          }
        } else {
          const customerResult = await updateCustomer(customerId, customerFormData);
          if (!customerResult.success) {
            console.error("Failed to update customer:", customerResult.error);
          }
        }
      } else if (localCustomer?.id) {
        const customerResult = await updateCustomer(localCustomer.id, customerFormData);
        if (customerResult.success) {
          setLocalCustomer(prev => ({ ...prev, ...customerResult.data }));
        }
        customerId = localCustomer.id;
      } else if (localOrder?.customer_id) {
        const customerResult = await updateCustomer(localOrder.customer_id, customerFormData);
        customerId = localOrder.customer_id;
      }

      if (mode === "createOrder" && customerId) {
        const orderResult = await addOrder(customerId, orderFormData);
        if (orderResult.success) {
          setLocalOrder(orderResult.data);
          setIsEditingOrder(false);
        }
      } else if (localOrder?.id) {
        const orderResult = await updateOrders(localOrder.id, orderFormData);
        if (orderResult.success) {
          setLocalOrder(orderResult.data);
          setIsEditingOrder(false);
        }
      }

      if (isEditingMeasurement && measurementFormData.type && customerId) {
        const existingMeasurement = measurements.find(m => m.type === measurementFormData.type);
        
        if (existingMeasurement) {
          const measurementResult = await updateMeasurement(
            customerId, 
            existingMeasurement.id, 
            measurementFormData
          );
          if (measurementResult.success) {
            setIsEditingMeasurement(false);
          }
        } else {
          const measurementResult = await addMeasurement(customerId, measurementFormData);
          if (measurementResult.success) {
            setIsEditingMeasurement(false);
          }
        }
      }

      setIsEditingCustomer(false);
      
      if (mode === "createOrder" || mode === "createCustomer") {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelAll = () => {
    if (mode === "createOrder" || mode === "createCustomer") {
      onOpenChange(false);
      return;
    }

    if (localOrder) {
      setCustomerFormData({
        name: localOrder?.customer_name || "",
        phone: localOrder?.phone || "",
        email: localOrder?.email || "",
        address: localOrder?.address || "",
        notes: localOrder?.notes || ""
      });
      setOrderFormData({
        type: localOrder?.type || "",
        quantity: localOrder?.quantity || 1,
        notes: localOrder?.order_notes || "",
        status: localOrder?.status || "",
        tag: localOrder?.tag,
        due_date: localOrder?.due_date ? localOrder.due_date.split('T')[0] : ""
      });
    } else if (localCustomer) {
      setCustomerFormData({
        name: localCustomer?.name || "",
        phone: localCustomer?.phone || "",
        email: localCustomer?.email || "",
        address: localCustomer?.address || "",
        notes: localCustomer?.notes || ""
      });
    }
    
    setIsEditingCustomer(false);
    setIsEditingOrder(false);
    setIsEditingMeasurement(false);
    setCreatingNewMeasurement(false);
    setCreatingNewOrder(false);
  };

  const openDeleteConfirmation = (type, id, itemName) => {
    let title, description;
    
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
    
    setDeleteConfirmation({
      open: true,
      type,
      id,
      title,
      description
    });
  };

  const handleConfirmDelete = async () => {
    const { type, id } = deleteConfirmation;
    
    try {
      switch (type) {
        case "order":
          const orderResult = await deleteOrder(id);
          if (orderResult.success) {
            if (localCustomer?.id) {
              setCustomerOrders(prev => prev.filter(o => o.id !== id));
            } else {
              onOpenChange(false);
            }
          }
          break;
        case "customer":
          const customerResult = await deleteCustomer(id);
          if (customerResult.success) {
            onOpenChange(false);
          }
          break;
        case "measurement":
          const customerId = localCustomer?.id || localOrder?.customer_id;
          if (customerId) {
            const measurementResult = await deleteMeasurement(customerId, id);
            if (measurementResult.success) {
              // Measurements will be updated in store automatically
            }
          }
          break;
        case "removeCustomer":
          const removeResult = await updateOrders(localOrder.id, { 
            customer_id: null,
            customer_name: "",
            phone: "",
            email: "",
            address: ""
          });
          if (removeResult.success) {
            setLocalOrder(removeResult.data);
            setSelectedCustomerId(null);
            setCustomerFormData({
              name: "",
              phone: "",
              email: "",
              address: "",
              notes: ""
            });
          }
          break;
      }
    } catch (error) {
      console.error("Error deleting:", error);
    } finally {
      setDeleteConfirmation({ open: false, type: null, id: null, title: "", description: "" });
    }
  };

  const isAnyEditing = isEditingCustomer || isEditingOrder || isEditingMeasurement || creatingNewMeasurement || creatingNewOrder;
  const isOrderContext = !!localOrder;
  const isCustomerContext = !!localCustomer;
  const isCreating = mode === "createOrder" || mode === "createCustomer";

  const displayName = isCreating 
    ? (mode === "createOrder" ? "Create New Order" : "Create New Customer")
    : (isOrderContext ? localOrder.customer_name : localCustomer?.name);

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:w-[800px] lg:w-[1200px] overflow-y-auto pt-16">
          <SheetViewHeader
            displayName={displayName}
            isCreating={isCreating}
            isOrderContext={isOrderContext}
            mode={mode}
            selectedTag={selectedTag}
            onTagChange={handleTagChange}
            isSavingTag={isSavingTag}
          />

          <Separator className="my-6" />

          {isAnyEditing && (
            <div className="flex gap-2 mb-4">
              <Button onClick={handleSaveAll} className="flex-1" disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Please wait...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save All Changes
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancelAll} disabled={isSaving}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          )}

          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <CustomerInformationCard
                isEditing={isEditingCustomer}
                isCreating={isCreating}
                mode={mode}
                isOrderContext={isOrderContext}
                isCustomerContext={isCustomerContext}
                customerFormData={customerFormData}
                onInputChange={handleCustomerInputChange}
                onEdit={() => setIsEditingCustomer(true)}
                onDelete={() => openDeleteConfirmation("customer", localCustomer.id, localCustomer.name)}
                onRemove={() => openDeleteConfirmation("removeCustomer", localOrder.id, customerFormData.name)}
                customers={customers}
                selectedCustomerId={selectedCustomerId}
                onCustomerSelect={handleCustomerSelect}
                openCustomerCombo={openCustomerCombo}
                onOpenCustomerCombo={setOpenCustomerCombo}
                customerSearch={customerSearch}
                onCustomerSearchChange={setCustomerSearch}
              />

              {(isOrderContext || mode === "createOrder") && (
                <OrderInformationCard
                  isEditing={isEditingOrder}
                  isCreating={mode === "createOrder"}
                  orderFormData={orderFormData}
                  onInputChange={handleOrderInputChange}
                  onEdit={() => setIsEditingOrder(true)}
                  onDelete={() => openDeleteConfirmation("order", localOrder.id, localOrder.customer_name)}
                />
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <OrdersTabContent
                localOrder={localOrder}
                customerOrders={customerOrders}
                loadingOrders={loadingOrders}
                editingOrderId={editingOrderId}
                orderCardFormData={orderCardFormData}
                onEditOrder={handleEditOrderCard}
                onSaveOrder={handleSaveOrderCard}
                onCancelOrder={handleCancelOrderCard}
                onDeleteOrder={(id, name) => openDeleteConfirmation("order", id, name)}
                onInputChange={handleOrderCardInputChange}
                onCreateNew={() => setCreatingNewOrder(true)}
              />
            </TabsContent>

            <TabsContent value="measurements" className="space-y-6">
              <MeasurementsTabContent
                measurements={measurements}
                loadingMeasurements={loadingMeasurements}
                isEditingMeasurement={isEditingMeasurement}
                creatingNewMeasurement={creatingNewMeasurement}
                measurementFormData={measurementFormData}
                onInputChange={handleMeasurementInputChange}
                onEdit={() => setIsEditingMeasurement(true)}
                onCreateNew={() => setCreatingNewMeasurement(true)}
                onDelete={(id, type) => openDeleteConfirmation("measurement", id, type)}
              />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <DeleteConfirmationDialog
        open={deleteConfirmation.open}
        onOpenChange={(open) => setDeleteConfirmation(prev => ({ ...prev, open }))}
        title={deleteConfirmation.title}
        description={deleteConfirmation.description}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
