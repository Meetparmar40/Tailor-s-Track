import { useEffect, useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Spinner, SpinnerContainer } from "@/components/ui/spinner.jsx";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Package,
    Ruler,
    Tag,
    Clock,
    Hash,
    ShoppingBag,
    Edit,
    Check,
    X,
    ChevronsUpDown,
    Save,
    Trash2,
    Plus,
    AlertTriangle,
    UserCheck,
    UserX,
} from "lucide-react";
import { format } from "date-fns";
import { useOrdersStore } from "@/store/useOrdersStore";
import { useCustomersStore } from "@/store/useCustomersStore";
import { useMeasurementsStore } from "@/store/useMeasurementsStore";
import { cn } from "@/lib/utils";

const tagConfig = {
    0: { name: "New", color: "text-chart-2", bg: "bg-accent"},
    1: { name: "Urgent", color: "text-destructive", bg: "bg-destructive/10"},
    2: { name: "Repair", color: "text-chart-1", bg: "bg-chart-1/10"},
    3: { name: "Done", color: "text-chart-4", bg: "bg-chart-4/10"}
};

const measurementTemplates = {
  shirt: {
    chest: "",
    waist: "",
    shoulder: "",
    sleeve_length: "",
    shirt_length: "",
    neck: ""
  },
  pant: {
    waist: "",
    hip: "",
    thigh: "",
    inseam: "",
    outseam: "",
    knee: "",
    bottom: ""
  },
  suit: {
    chest: "",
    waist: "",
    shoulder: "",
    sleeve_length: "",
    jacket_length: "",
    neck: "",
    pant_waist: "",
    pant_length: "",
    inseam: ""
  },
  kurta: {
    chest: "",
    waist: "",
    shoulder: "",
    sleeve_length: "",
    kurta_length: "",
    neck: ""
  }
};

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
    type: null, // "order", "customer", "measurement", "removeCustomer"
    id: null,
    title: "",
    description: ""
  });

  // Initialize data based on mode and props
  useEffect(() => {
    if (mode === "createOrder") {
      // Initialize for creating new order
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
      // Initialize for creating new customer
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
      // View/edit existing order
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
      // View/edit existing customer
      setLocalCustomer(customer);
      setLocalOrder(null);
      setCustomerFormData({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
        notes: customer.notes || ""
      });
      
      // Fetch all orders and measurements for this customer
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

  const safeFormatDate = (value, fallback = "Not set") => {
    if (!value) return fallback;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return fallback;
    return format(date, "PPP");
  };

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
      
      // Load measurements for selected customer
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
      
      // Create or update customer first
      if (mode === "createOrder" || mode === "createCustomer") {
        if (!selectedCustomerId) {
          // Create new customer
          const customerResult = await addCustomer(customerFormData);
          if (customerResult.success) {
            customerId = customerResult.data.id;
            setSelectedCustomerId(customerId);
          } else {
            console.error("Failed to create customer:", customerResult.error);
            return;
          }
        } else {
          // Update existing customer
          const customerResult = await updateCustomer(customerId, customerFormData);
          if (!customerResult.success) {
            console.error("Failed to update customer:", customerResult.error);
          }
        }
      } else if (localCustomer?.id) {
        // Update customer in customer view
        const customerResult = await updateCustomer(localCustomer.id, customerFormData);
        if (customerResult.success) {
          setLocalCustomer(prev => ({ ...prev, ...customerResult.data }));
        }
        customerId = localCustomer.id;
      } else if (localOrder?.customer_id) {
        // Update customer in order view
        const customerResult = await updateCustomer(localOrder.customer_id, customerFormData);
        customerId = localOrder.customer_id;
      }

      // Create or update order
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

      // Create or update measurement
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

    // Reset to original values
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
              // Remove from customer orders list
              setCustomerOrders(prev => prev.filter(o => o.id !== id));
            } else {
              // Close sheet if viewing this order
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
          // Update order to remove customer association
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
  
  const displayId = isOrderContext ? localOrder.id : localCustomer?.id;

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.phone?.includes(customerSearch) ||
    customer.email?.toLowerCase().includes(customerSearch.toLowerCase())
  );

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:w-[800px] lg:w-[1200px] overflow-y-auto pt-16">
          <SheetHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <SheetTitle className="text-2xl flex items-center gap-2">
                  <User className="h-6 w-6 text-primary" />
                  {displayName}
                </SheetTitle>
                <SheetDescription className="flex items-center gap-2 text-base">
                  {isCreating 
                    ? (mode === "createOrder" ? "Creating new order" : "Creating new customer")
                    : (isOrderContext ? "Order Details" : "Customer Details")
                  }
                </SheetDescription>
              </div>
              
              {!isCreating && (
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex items-center gap-2">
                    <Select 
                      value={selectedTag?.toString()} 
                      onValueChange={handleTagChange}
                      disabled={isSavingTag}
                    >
                      <SelectTrigger className="w-[130px] h-7">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(tagConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div className={cn("w-2 h-2 rounded-full", config.bg)} />
                              {config.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {isSavingTag && <Spinner size="sm" className="h-3 w-3" />}
                  </div>
                </div>
              )}
            </div>
          </SheetHeader>

          <Separator className="my-6" />

          {/* Save/Cancel buttons when editing */}
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

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              {/* Customer Information Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Customer Information
                      </CardTitle>
                      <CardDescription>
                        {isCreating ? "Enter customer details" : "Customer contact and personal information"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {!isAnyEditing && !isCreating && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsEditingCustomer(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      )}
                      {(mode === "createOrder") && (
                        <div className="flex gap-2">
                          <Popover open={openCustomerCombo} onOpenChange={setOpenCustomerCombo}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                role="combobox"
                                aria-expanded={openCustomerCombo}
                                className="w-[200px] justify-between"
                              >
                                {selectedCustomerId 
                                  ? customers.find(c => c.id === selectedCustomerId)?.name
                                  : "Select customer..."
                                }
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput 
                                  placeholder="Search customers..." 
                                  value={customerSearch}
                                  onValueChange={setCustomerSearch}
                                />
                                <CommandList>
                                  <CommandEmpty>No customer found.</CommandEmpty>
                                  <CommandGroup>
                                    {filteredCustomers.map((customer) => (
                                      <CommandItem
                                        key={customer.id}
                                        value={customer.id}
                                        onSelect={() => handleCustomerSelect(customer.id)}
                                      >
                                        <Check
                                          className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedCustomerId === customer.id ? "opacity-100" : "opacity-0"
                                          )}
                                        />
                                        <div>
                                          <div className="font-medium">{customer.name}</div>
                                          <div className="text-xs text-muted-foreground">{customer.phone}</div>
                                        </div>
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </div>
                      )}
                      {!isCreating && isCustomerContext && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => openDeleteConfirmation("customer", localCustomer.id, localCustomer.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Customer
                        </Button>
                      )}
                      {!isCreating && isOrderContext && selectedCustomerId && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDeleteConfirmation("removeCustomer", localOrder.id, customerFormData.name)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
                          Remove Customer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingCustomer || isCreating ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={customerFormData.name}
                          onChange={(e) => handleCustomerInputChange("name", e.target.value)}
                          placeholder="Customer name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={customerFormData.phone}
                          onChange={(e) => handleCustomerInputChange("phone", e.target.value)}
                          placeholder="Phone number"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={customerFormData.email}
                          onChange={(e) => handleCustomerInputChange("email", e.target.value)}
                          placeholder="Email address"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={customerFormData.address}
                          onChange={(e) => handleCustomerInputChange("address", e.target.value)}
                          placeholder="Address"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          value={customerFormData.notes}
                          onChange={(e) => handleCustomerInputChange("notes", e.target.value)}
                          placeholder="Additional notes"
                          rows={3}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Name:</span>
                          <span>{customerFormData.name || "Not set"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Phone:</span>
                          <span>{customerFormData.phone || "Not set"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Email:</span>
                          <span>{customerFormData.email || "Not set"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Address:</span>
                          <span>{customerFormData.address || "Not set"}</span>
                        </div>
                      </div>
                      {customerFormData.notes && (
                        <div className="space-y-2">
                          <span className="font-medium">Notes:</span>
                          <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                            {customerFormData.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Information Card - Only show if in order context or creating order */}
              {(isOrderContext || mode === "createOrder") && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Order Information
                        </CardTitle>
                        <CardDescription>
                          {mode === "createOrder" ? "Enter order details" : "Order specifics and requirements"}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        {!isAnyEditing && !isCreating && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingOrder(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        )}
                        {!isCreating && isOrderContext && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => openDeleteConfirmation("order", localOrder.id, localOrder.customer_name)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditingOrder || mode === "createOrder" ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="type">Garment Type</Label>
                          <Select value={orderFormData.type} onValueChange={(value) => handleOrderInputChange("type", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select garment type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="shirt">Shirt</SelectItem>
                              <SelectItem value="pant">Pant</SelectItem>
                              <SelectItem value="suit">Suit</SelectItem>
                              <SelectItem value="kurta">Kurta</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={orderFormData.quantity}
                            onChange={(e) => handleOrderInputChange("quantity", parseInt(e.target.value))}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Input
                            id="status"
                            value={orderFormData.status}
                            onChange={(e) => handleOrderInputChange("status", e.target.value)}
                            placeholder="Order status"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="due_date">Due Date</Label>
                          <Input
                            id="due_date"
                            type="date"
                            value={orderFormData.due_date}
                            onChange={(e) => handleOrderInputChange("due_date", e.target.value)}
                          />
                        </div>
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="order_notes">Order Notes</Label>
                          <Textarea
                            id="order_notes"
                            value={orderFormData.notes}
                            onChange={(e) => handleOrderInputChange("notes", e.target.value)}
                            placeholder="Order specific notes"
                            rows={3}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Type:</span>
                            <Badge variant="secondary">{orderFormData.type || "Not set"}</Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Quantity:</span>
                            <span>{orderFormData.quantity || "Not set"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Status:</span>
                            <span>{orderFormData.status || "Not set"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Due Date:</span>
                            <span>{safeFormatDate(orderFormData.due_date)}</span>
                          </div>
                        </div>
                        {orderFormData.notes && (
                          <div className="space-y-2">
                            <span className="font-medium">Order Notes:</span>
                            <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded">
                              {orderFormData.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Customer Orders
                      </CardTitle>
                      <CardDescription>
                        All orders for this customer
                      </CardDescription>
                    </div>
                    <Button
                      onClick={() => setCreatingNewOrder(true)}
                      size="sm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Order
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingOrders ? (
                    <SpinnerContainer>
                      <Spinner />
                    </SpinnerContainer>
                  ) : customerOrders.length > 0 || isOrderContext ? (
                    <div className="space-y-4">
                      {/* Current order if in order context */}
                      {isOrderContext && (
                        <div className="border rounded-lg p-4 bg-blue-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">Current Order</Badge>
                                <Badge className={tagConfig[localOrder.tag]?.bg}>
                                  {tagConfig[localOrder.tag]?.name}
                                </Badge>
                              </div>
                              <h4 className="font-medium">
                                {localOrder.quantity} {localOrder.type}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Created: {safeFormatDate(localOrder.order_date)}
                              </p>
                              {localOrder.due_date && (
                                <p className="text-sm text-muted-foreground">
                                  Due: {safeFormatDate(localOrder.due_date)}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditingOrder(true)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => openDeleteConfirmation("order", localOrder.id, localOrder.customer_name)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Other orders */}
                      {customerOrders.map((order) => {
                        const isEditing = editingOrderId === order.id;
                        const formData = orderCardFormData[order.id] || {};
                        
                        return (
                          <div key={order.id} className="border rounded-lg p-4">
                            {isEditing ? (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Select 
                                      value={formData.type || order.type} 
                                      onValueChange={(value) => handleOrderCardInputChange(order.id, "type", value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="shirt">Shirt</SelectItem>
                                        <SelectItem value="pant">Pant</SelectItem>
                                        <SelectItem value="suit">Suit</SelectItem>
                                        <SelectItem value="kurta">Kurta</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Quantity</Label>
                                    <Input
                                      type="number"
                                      min="1"
                                      value={formData.quantity || order.quantity}
                                      onChange={(e) => handleOrderCardInputChange(order.id, "quantity", parseInt(e.target.value))}
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={() => handleSaveOrderCard(order.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Save
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => handleCancelOrderCard(order.id)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge className={tagConfig[order.tag]?.bg}>
                                      {tagConfig[order.tag]?.name}
                                    </Badge>
                                  </div>
                                  <h4 className="font-medium">
                                    {order.quantity} {order.type}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Created: {safeFormatDate(order.order_date)}
                                  </p>
                                  {order.due_date && (
                                    <p className="text-sm text-muted-foreground">
                                      Due: {safeFormatDate(order.due_date)}
                                    </p>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditOrderCard(order)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => openDeleteConfirmation("order", order.id, `${order.quantity} ${order.type}`)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <ShoppingBag className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No orders found</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Measurements Tab */}
            <TabsContent value="measurements" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Ruler className="h-5 w-5" />
                        Customer Measurements
                      </CardTitle>
                      <CardDescription>
                        Body measurements for tailoring
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {!isEditingMeasurement && !creatingNewMeasurement && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingMeasurement(true)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => setCreatingNewMeasurement(true)}
                            size="sm"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Measurement
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingMeasurements ? (
                    <SpinnerContainer>
                      <Spinner />
                    </SpinnerContainer>
                  ) : (
                    <>
                      {(isEditingMeasurement || creatingNewMeasurement) && (
                        <div className="mb-6 p-4 border rounded-lg bg-blue-50">
                          <h4 className="font-medium mb-4">
                            {creatingNewMeasurement ? "Add New Measurement" : "Edit Measurement"}
                          </h4>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Garment Type</Label>
                              <Select
                                value={measurementFormData.type}
                                onValueChange={(value) => handleMeasurementInputChange("type", value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select garment type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="shirt">Shirt</SelectItem>
                                  <SelectItem value="pant">Pant</SelectItem>
                                  <SelectItem value="suit">Suit</SelectItem>
                                  <SelectItem value="kurta">Kurta</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {measurementFormData.type && (
                              <div className="grid grid-cols-2 gap-4">
                                {Object.keys(measurementTemplates[measurementFormData.type] || {}).map((field) => (
                                  <div key={field} className="space-y-2">
                                    <Label>{field.replace(/_/g, " ").toUpperCase()}</Label>
                                    <Input
                                      type="number"
                                      step="0.1"
                                      value={measurementFormData.data[field] || ""}
                                      onChange={(e) => handleMeasurementInputChange(field, e.target.value)}
                                      placeholder="cm"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {measurements && measurements.length > 0 ? (
                        <div className="space-y-4">
                          {measurements.map((measurement) => (
                            <div key={measurement.id} className="border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium capitalize flex items-center gap-2">
                                  <Badge variant="secondary">{measurement.type}</Badge>
                                  Measurements
                                </h4>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => openDeleteConfirmation("measurement", measurement.id, measurement.type)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-3 gap-4">
                                {Object.entries(measurement.data || {}).map(([key, value]) => (
                                  <div key={key} className="text-center">
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {key.replace(/_/g, " ")}
                                    </p>
                                    <p className="font-medium text-lg">{value} cm</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Ruler className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>No measurements available</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-4"
                            onClick={() => setCreatingNewMeasurement(true)}
                          >
                            Add Measurements
                          </Button>
                        </div>
                      )}
                    </>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmation.open} onOpenChange={(open) => 
        setDeleteConfirmation(prev => ({ ...prev, open }))
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              {deleteConfirmation.title}
            </DialogTitle>
            <DialogDescription>
              {deleteConfirmation.description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmation(prev => ({ ...prev, open: false }))}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}