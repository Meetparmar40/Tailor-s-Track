import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomersStore } from "../store/useCustomersStore";
import { useOrdersStore } from "../store/useOrdersStore";
import { useAuthContext } from "../components/AuthProvider";
import { CLOTH_TYPES } from "../components/layout/SheetView/measurementTemplates.js";
import { 
  ORDER_STATUSES, 
  STATUS_DISPLAY_LABELS, 
  getStatusFromTag,
  getTypeDisplayLabel 
} from "../components/layout/SheetView/orderConstants.js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Check, X, Search, UserPlus, User, Loader2 } from "lucide-react";
import { Spinner, SpinnerContainer } from "@/components/ui/spinner.jsx";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

export default function CreateOrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userId } = useAuthContext();
  
  // Get query params for pre-selection
  const preselectedCustomerId = searchParams.get("customerId");
  const preselectedTag = searchParams.get("tag");
  
  const { customers, fetchCustomers, addCustomer, loading: customersLoading } = useCustomersStore();
  const { createOrder } = useOrdersStore();
  
  // Customer selection state
  const [customerMode, setCustomerMode] = useState("select"); // "select" | "new"
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [showCustomerSearch, setShowCustomerSearch] = useState(false);
  
  // New customer form
  const [newCustomerForm, setNewCustomerForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });
  
  // Order form state
  const [orderForm, setOrderForm] = useState({
    type: "",
    quantity: 1,
    status: preselectedTag ? getStatusFromTag(parseInt(preselectedTag)) : ORDER_STATUSES.NEW,
    notes: "",
    tag: preselectedTag ? parseInt(preselectedTag) : 0,
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const customerSearchRef = useRef(null);
  const newCustomerNameRef = useRef(null);
  const orderTypeRef = useRef(null);

  // Auto-focus customer search (if no preselected customer)
  useEffect(() => {
    if (!preselectedCustomerId && customerSearchRef.current) {
      setTimeout(() => customerSearchRef.current?.focus(), 100);
    }
  }, [preselectedCustomerId]);

  // Auto-focus new customer name when switching to new customer mode
  useEffect(() => {
    if (customerMode === "new" && newCustomerNameRef.current) {
      newCustomerNameRef.current.focus();
    }
  }, [customerMode]);

  // Auto-focus order type when customer is selected
  useEffect(() => {
    if (selectedCustomer && orderTypeRef.current) {
      setTimeout(() => orderTypeRef.current?.focus(), 100);
    }
  }, [selectedCustomer]);

  // Fetch customers on mount
  useEffect(() => {
    if (userId && customers.length === 0) {
      fetchCustomers(userId, { limit: 100 });
    }
  }, [userId, customers.length, fetchCustomers]);

  // Pre-select customer if customerId is provided
  useEffect(() => {
    if (preselectedCustomerId && customers.length > 0) {
      const customer = customers.find(c => String(c.id) === String(preselectedCustomerId));
      if (customer) {
        setSelectedCustomer(customer);
        setCustomerMode("select");
      }
    }
  }, [preselectedCustomerId, customers]);

  // Filter customers based on search query
  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery.trim()) return customers.slice(0, 10);
    
    const query = customerSearchQuery.toLowerCase();
    return customers.filter(c => 
      (c.name && c.name.toLowerCase().includes(query)) ||
      (c.phone && c.phone.includes(query)) ||
      (c.email && c.email.toLowerCase().includes(query))
    ).slice(0, 10);
  }, [customers, customerSearchQuery]);

  const handleSelectCustomer = useCallback((customer) => {
    setSelectedCustomer(customer);
    setShowCustomerSearch(false);
    setCustomerSearchQuery("");
  }, []);

  const handleCreateNewCustomer = async () => {
    if (!newCustomerForm.name.trim()) {
      setError("Customer name is required");
      return null;
    }
    
    const result = await addCustomer(userId, newCustomerForm);
    if (result?.success) {
      setSelectedCustomer(result.data);
      setCustomerMode("select");
      return result.data;
    } else {
      setError(result?.error || "Failed to create customer");
      return null;
    }
  };

  const handleSubmit = async () => {
    setError(null);
    
    // Validate order form
    if (!orderForm.type) {
      setError("Please select an order type");
      return;
    }
    
    if (!orderForm.status) {
      setError("Please select an order status");
      return;
    }
    
    setIsSaving(true);
    
    try {
      let customerId = selectedCustomer?.id;
      
      // If creating new customer, do that first
      if (customerMode === "new" && !selectedCustomer) {
        const newCustomer = await handleCreateNewCustomer();
        if (!newCustomer) {
          setIsSaving(false);
          return;
        }
        customerId = newCustomer.id;
      }
      
      if (!customerId) {
        setError("Please select or create a customer");
        setIsSaving(false);
        return;
      }
      
      // Create the order
      const result = await createOrder(userId, customerId, orderForm);
      
      if (result?.success) {
        navigate(`/orders/${result.data.id}`);
      } else {
        setError(result?.error || "Failed to create order");
      }
    } catch (err) {
      setError("Something went wrong");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const updateOrderForm = (updates) => {
    setOrderForm(prev => ({ ...prev, ...updates }));
  };

  const updateNewCustomerForm = (updates) => {
    setNewCustomerForm(prev => ({ ...prev, ...updates }));
  };

  if (customersLoading && customers.length === 0) {
    return (
      <SpinnerContainer>
        <Spinner size="xl" />
      </SpinnerContainer>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-3xl">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Create New Order</h1>
        <p className="text-sm text-muted-foreground">Add a new order for a customer</p>
      </div>

      <Separator className="my-6" />

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Customer Section */}
        <div className="bg-muted/30 rounded-lg p-6 border border-muted/50">
          <h2 className="text-lg font-semibold mb-4">Customer Details</h2>
          
          {/* Mode Toggle - only show if no preselected customer */}
          {!preselectedCustomerId && (
            <div className="flex gap-2 mb-4">
              <Button
                variant={customerMode === "select" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCustomerMode("select");
                  setSelectedCustomer(null);
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                Select Existing
              </Button>
              <Button
                variant={customerMode === "new" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setCustomerMode("new");
                  setSelectedCustomer(null);
                }}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </div>
          )}

          {customerMode === "select" ? (
            <div>
              {selectedCustomer ? (
                /* Selected Customer Display */
                <div className="flex items-center justify-between p-4 bg-background rounded-md border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedCustomer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedCustomer.phone || selectedCustomer.email || "No contact info"}
                      </p>
                    </div>
                  </div>
                  {!preselectedCustomerId && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCustomer(null);
                        setShowCustomerSearch(true);
                      }}
                    >
                      Change
                    </Button>
                  )}
                </div>
              ) : (
                /* Customer Search */
                <div className="relative">
                  <Command className="rounded-lg border shadow-md">
                    <CommandInput
                      placeholder="Search customers by name, phone, or email..."
                      value={customerSearchQuery}
                      onValueChange={setCustomerSearchQuery}
                    />
                    <CommandList className="max-h-[200px]">
                      <CommandEmpty>
                        {customersLoading ? (
                          <div className="flex items-center justify-center p-4 text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Loading...
                          </div>
                        ) : (
                          <div className="p-4 text-center">
                            <p className="text-muted-foreground mb-2">No customers found</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCustomerMode("new")}
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Create New Customer
                            </Button>
                          </div>
                        )}
                      </CommandEmpty>
                      {filteredCustomers.length > 0 && (
                        <CommandGroup heading="Customers">
                          {filteredCustomers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              onSelect={() => handleSelectCustomer(customer)}
                              className="cursor-pointer"
                            >
                              <User className="mr-2 h-4 w-4 text-muted-foreground" />
                              <div className="flex flex-col">
                                <span className="font-medium">{customer.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {customer.phone || customer.email || "No contact"}
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </div>
              )}
            </div>
          ) : (
            /* New Customer Form */
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Name *</label>
                  <Input
                    ref={newCustomerNameRef}
                    value={newCustomerForm.name}
                    onChange={(e) => updateNewCustomerForm({ name: e.target.value })}
                    placeholder="Customer name"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Phone</label>
                  <Input
                    value={newCustomerForm.phone}
                    onChange={(e) => updateNewCustomerForm({ phone: e.target.value })}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                  <Input
                    value={newCustomerForm.email}
                    onChange={(e) => updateNewCustomerForm({ email: e.target.value })}
                    placeholder="Email address"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
                  <Input
                    value={newCustomerForm.notes}
                    onChange={(e) => updateNewCustomerForm({ notes: e.target.value })}
                    placeholder="Customer notes"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Section */}
        <div className="bg-muted/30 rounded-lg p-6 border border-muted/50">
          <h2 className="text-lg font-semibold mb-4">Order Details</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Order Type *</label>
              <Select
                value={orderForm.type}
                onValueChange={(val) => updateOrderForm({ type: val })}
              >
                <SelectTrigger ref={orderTypeRef}>
                  <SelectValue placeholder="Select order type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(CLOTH_TYPES).map((type) => (
                    <SelectItem key={type} value={type}>
                      {getTypeDisplayLabel(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Quantity</label>
              <Input
                type="number"
                min="1"
                value={orderForm.quantity}
                onChange={(e) => updateOrderForm({ quantity: parseInt(e.target.value) || 1 })}
                placeholder="Quantity"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Status *</label>
              <Select
                value={orderForm.status}
                onValueChange={(val) => updateOrderForm({ status: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_DISPLAY_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs text-muted-foreground mb-1 block">Notes</label>
              <Textarea
                value={orderForm.notes}
                onChange={(e) => updateOrderForm({ notes: e.target.value })}
                placeholder="Order notes"
                className="min-h-20"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            disabled={isSaving}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Create Order
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}