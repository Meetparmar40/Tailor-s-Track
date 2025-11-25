import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCustomersStore } from "../store/useCustomersStore";
import useCustomerSheetController from "../components/layout/SheetView/controllers/useCustomerSheetController";
import SectionCard from "../components/layout/SheetView/ui/SectionCard";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, ChevronDown, ChevronUp, Edit2, Trash2, Check, X, ArrowLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEASUREMENT_TEMPLATES, CLOTH_TYPES } from "../components/layout/SheetView/measurementTemplates.js";
import { Spinner, SpinnerContainer } from "@/components/ui/spinner.jsx";

export default function CustomerDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { customers, loading } = useCustomersStore();

    const isNew = id === "new";
    const customer = isNew ? {} : customers.find((c) => String(c.id) === String(id));

    if (loading) {
        return (
            <SpinnerContainer>
                <Spinner size="xl" />
            </SpinnerContainer>
        );
    }

    if (!customer && !isNew) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4">
                <p className="text-lg text-muted-foreground">Customer not found</p>
                <Button onClick={() => navigate("/")}>Go Home</Button>
            </div>
        )
    }

    return <CustomerDetailsContent customer={customer} navigate={navigate} />;
}

function CustomerDetailsContent({ customer, navigate }) {
    const customerCtrl = useCustomerSheetController({ customer, onClose: () => navigate(-1) });
    const { state, handlers, isSaving, displayName } = customerCtrl;

    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [expandedMeasurementId, setExpandedMeasurementId] = useState(null);
    const [editingCustomer, setEditingCustomer] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [editingMeasurement, setEditingMeasurement] = useState(null);
    const [addingOrder, setAddingOrder] = useState(null);
    const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
    const [measureType, setMeasureType] = useState(CLOTH_TYPES.SHIRT);
    const [measureValues, setMeasureValues] = useState({});

    const resetMeasurementForm = () => {
        setMeasureType(CLOTH_TYPES.SHIRT);
        setMeasureValues({});
        setIsAddingMeasurement(false);
        setEditingMeasurement(null);
    };

    const handleMeasureValueChange = (key, value) => {
        setMeasureValues(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">
            <div className="mb-6">
                <Button variant="ghost" className="pl-0 hover:bg-transparent" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
            </div>

            <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-primary">{displayName}</h3>
                    <p className="text-sm text-muted-foreground">Customer profile</p>
                </div>
            </div>

            <Separator className="my-6" />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* left column: customer info */}
                <div className="lg:col-span-1">
                    <SectionCard title="Customer Information" subtitle="Contact & personal details">
                        <div className="space-y-3">
                            {!editingCustomer ? (
                                <>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Name</p>
                                        <p className="font-medium text-primary">{state.customerForm.name || "-"}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">Phone</p>
                                        <p className="font-medium">{state.customerForm.phone || "Not set"}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">Email</p>
                                        <p className="font-medium">{state.customerForm.email || "Not set"}</p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground">Notes</p>
                                        <p className="font-medium">{state.customerForm.notes || "Not set"}</p>
                                    </div>

                                    <div className="mt-4">
                                        <Button variant="ghost" size="sm" onClick={() => setEditingCustomer(true)}>
                                            <Edit2 className="mr-2 h-3 w-3" /> Edit Customer
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Name</p>
                                        <Input
                                            value={state.customerForm.name}
                                            onChange={(e) => handlers.setCustomerForm({ name: e.target.value })}
                                            placeholder="Customer name"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Phone</p>
                                        <Input
                                            value={state.customerForm.phone}
                                            onChange={(e) => handlers.setCustomerForm({ phone: e.target.value })}
                                            placeholder="Phone number"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Email</p>
                                        <Input
                                            value={state.customerForm.email}
                                            onChange={(e) => handlers.setCustomerForm({ email: e.target.value })}
                                            placeholder="Email address"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs text-muted-foreground mb-1">Notes</p>
                                        <Textarea
                                            value={state.customerForm.notes}
                                            onChange={(e) => handlers.setCustomerForm({ notes: e.target.value })}
                                            placeholder="Customer notes"
                                            className="min-h-20"
                                        />
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                handlers.handleSaveAll();
                                                setEditingCustomer(false);
                                            }}
                                            disabled={isSaving}
                                        >
                                            <Check className="mr-2 h-3 w-3" /> Done
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                handlers.handleCancelAll();
                                                setEditingCustomer(false);
                                            }}
                                        >
                                            <X className="mr-2 h-3 w-3" /> Cancel
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </SectionCard>
                </div>

                {/* orders list — wide column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold">Orders</h4>
                        <Button size="sm" onClick={() => setAddingOrder({
                            customer_id: customer.id,
                            type: "",
                            quantity: 1,
                            status: "",
                            notes: "",
                            due_date: ""
                        })}>
                            <PlusCircle className="mr-2 h-3 w-3" /> New Order
                        </Button>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-4 border border-muted/50">
                        {state.loadingOrders ? (
                            <p className="text-sm text-muted-foreground">Loading orders...</p>
                        ) : (
                            <>
                                {addingOrder && (
                                    <div className="mb-3 bg-background/60 rounded-md border border-border p-3">
                                        <p className="text-xs font-semibold mb-2">New Order</p>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Type</p>
                                                <Select
                                                    value={state.orderForm.type || ""}
                                                    onValueChange={(val) => handlers.setOrderForm({ type: val })}
                                                >
                                                    <SelectTrigger className="h-9 text-sm">
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(CLOTH_TYPES).map((type) => (
                                                            <SelectItem key={type} value={type}>{type}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                                                <Input
                                                    placeholder="Quantity"
                                                    type="number"
                                                    value={state.orderForm.quantity || 1}
                                                    onChange={(e) => handlers.setOrderForm({ quantity: e.target.value })}
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Status</p>
                                                <Input
                                                    placeholder="Status"
                                                    value={state.orderForm.status || ""}
                                                    onChange={(e) => handlers.setOrderForm({ status: e.target.value })}
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                                                <Input
                                                    type="date"
                                                    value={state.orderForm.due_date || ""}
                                                    onChange={(e) => handlers.setOrderForm({ due_date: e.target.value })}
                                                    className="text-sm"
                                                />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground mb-1">Notes</p>
                                                <Textarea
                                                    placeholder="Order notes"
                                                    value={state.orderForm.notes || ""}
                                                    onChange={(e) => handlers.setOrderForm({ notes: e.target.value })}
                                                    className="text-sm min-h-20"
                                                />
                                            </div>
                                            <div className="flex gap-2 mt-3">
                                                <Button size="sm"
                                                    onClick={async () => {
                                                        const success = await handlers.createOrder();
                                                        if (success) setAddingOrder(null);
                                                    }}
                                                    disabled={isSaving}>
                                                    <Check className="mr-1 h-3 w-3" /> Done
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setAddingOrder(null);
                                                    }}
                                                >
                                                    <X className="mr-1 h-3 w-3" /> Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {state.customerOrders?.length ? (
                                    <ul className="space-y-2">
                                        {state.customerOrders.map((o) => (
                                            <li key={o.id} className="bg-background/60 rounded-md border border-border overflow-hidden">
                                                <div
                                                    className="flex items-center justify-between gap-4 p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                                                    onClick={() => setExpandedOrderId(expandedOrderId === o.id ? null : o.id)}
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{o.type} — {o.quantity} items</p>
                                                        <p className="text-xs text-muted-foreground">Status: {o.status || "—"}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {expandedOrderId === o.id ? (
                                                            <ChevronUp className="h-4 w-4 text-muted-foreground" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                                        )}
                                                    </div>
                                                </div>

                                                {expandedOrderId === o.id && (
                                                    <div className="px-3 pb-3 pt-2 border-t border-border/50 bg-muted/10 animate-in slide-in-from-top-2 duration-200">
                                                        {editingOrder?.id !== o.id ? (
                                                            <>
                                                                <div>
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Due Date</p>
                                                                        <p className="text-sm">{o.due_date ? new Date(o.due_date).toLocaleDateString() : "Not set"}</p>
                                                                    </div>
                                                                    <div>
                                                                        <p className="text-xs text-muted-foreground">Notes</p>
                                                                        <p className="text-sm">{o.notes || "—"}</p>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="flex gap-2">
                                                                        <Button variant="ghost" size="sm" onClick={() => {
                                                                            handlers.prepareEditOrder(o);
                                                                            setEditingOrder(o);
                                                                        }}>
                                                                            <Edit2 className="mr-1 h-3 w-3" /> Edit
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handlers.deleteOrder(o.id)}
                                                                            className="text-destructive hover:text-destructive"
                                                                        >
                                                                            <Trash2 className="mr-1 h-3 w-3" /> Delete
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground mb-1">Type</p>
                                                                    <Select
                                                                        value={state.orderForm.type}
                                                                        onValueChange={(val) => handlers.setOrderForm({ type: val })}
                                                                    >
                                                                        <SelectTrigger className="h-9 text-sm">
                                                                            <SelectValue placeholder="Select Type" />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            {Object.values(CLOTH_TYPES).map((type) => (
                                                                                <SelectItem key={type} value={type}>{type}</SelectItem>
                                                                            ))}
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                                                                    <Input
                                                                        placeholder="Quantity"
                                                                        type="number"
                                                                        value={state.orderForm.quantity}
                                                                        onChange={(e) => handlers.setOrderForm({ quantity: e.target.value })}
                                                                        className="text-sm"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                                                                    <Input
                                                                        placeholder="Status"
                                                                        value={state.orderForm.status}
                                                                        onChange={(e) => handlers.setOrderForm({ status: e.target.value })}
                                                                        className="text-sm"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                                                                    <Input
                                                                        type="date"
                                                                        value={state.orderForm.due_date}
                                                                        onChange={(e) => handlers.setOrderForm({ due_date: e.target.value })}
                                                                        className="text-sm"
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                                                                    <Textarea
                                                                        placeholder="Order notes"
                                                                        value={state.orderForm.notes}
                                                                        onChange={(e) => handlers.setOrderForm({ notes: e.target.value })}
                                                                        className="text-sm min-h-20"
                                                                    />
                                                                </div>
                                                                <div className="flex gap-2 mt-3">
                                                                    <Button size="sm"
                                                                        onClick={async () => {
                                                                            const success = await handlers.updateOrder(o.id);
                                                                            if (success) setEditingOrder(null);
                                                                        }}
                                                                        disabled={isSaving}>
                                                                        <Check className="mr-1 h-3 w-3" /> Done
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setEditingOrder(null);
                                                                        }}
                                                                    >
                                                                        <X className="mr-1 h-3 w-3" /> Cancel
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-muted-foreground">No orders for this customer.</p>
                                )}
                            </>
                        )}
                    </div>

                    {/* measurements list */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-lg font-semibold">Measurements</h4>
                            {!isAddingMeasurement && (
                                <Button size="sm" onClick={() => {
                                    setMeasureType(CLOTH_TYPES.SHIRT); // Default
                                    setMeasureValues({});
                                    setIsAddingMeasurement(true);
                                }}>
                                    <PlusCircle className="mr-2 h-3 w-3" /> New Measurement
                                </Button>
                            )}
                        </div>

                        <div className="bg-muted/30 rounded-lg p-4 border border-muted/50">

                            {/* ADD NEW MEASUREMENT FORM */}
                            {isAddingMeasurement && (
                                <div className="mb-3 bg-background rounded-md border border-border p-4 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <p className="text-sm font-semibold">Add New Measurement</p>
                                        <Select value={measureType} onValueChange={(val) => {
                                            setMeasureType(val);
                                            setMeasureValues({}); // Clear values on type switch
                                        }}>
                                            <SelectTrigger className="w-[180px] h-8">
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(CLOTH_TYPES).map((type) => (
                                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Dynamic Inputs Grid */}
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                                        {MEASUREMENT_TEMPLATES[measureType]?.map((field) => (
                                            <div key={field.key}>
                                                <p className="text-xs text-muted-foreground mb-1">{field.label}</p>
                                                <Input
                                                    className="h-8 text-sm"
                                                    value={measureValues[field.key] || ""}
                                                    onChange={(e) => handleMeasureValueChange(field.key, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-2 justify-end">
                                        <Button variant="outline" size="sm" onClick={resetMeasurementForm}>
                                            <X className="mr-1 h-3 w-3" /> Cancel
                                        </Button>
                                        <Button size="sm" onClick={() => {
                                            // Assuming controller has createMeasurement(type, json_values)
                                            customerCtrl.handlers.createMeasurement({
                                                type: measureType,
                                                measurement: measureValues
                                            });
                                            resetMeasurementForm();
                                        }}>
                                            <Check className="mr-1 h-3 w-3" /> Save
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* LIST OF EXISTING MEASUREMENTS */}
                            {customerCtrl.measurementsStore.measurements?.length ? (
                                <ul className="space-y-2">
                                    {customerCtrl.measurementsStore.measurements.map((m) => {
                                        const isEditing = editingMeasurement?.id === m.id;

                                        return (
                                            <li key={m.id} className="bg-background/60 rounded-md border border-border overflow-hidden">

                                                {/* Measurement Header (Click to Expand) */}
                                                <div
                                                    className="flex items-center justify-between gap-4 p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                                                    onClick={() => {
                                                        if (!isEditing) setExpandedMeasurementId(expandedMeasurementId === m.id ? null : m.id)
                                                    }}
                                                >
                                                    <div className="flex-1">
                                                        <p className="font-medium text-sm">{m.type}</p>
                                                        {!expandedMeasurementId && expandedMeasurementId !== m.id && (
                                                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                                                {/* Quick preview of values */}
                                                                {Object.entries(m.data || {}).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {expandedMeasurementId === m.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                                                    </div>
                                                </div>

                                                {/* Expanded Details */}
                                                {expandedMeasurementId === m.id && (
                                                    <div className="px-3 pb-3 pt-2 border-t border-border/50 bg-muted/10">
                                                        {isEditing ? (
                                                            /* EDIT MODE */
                                                            <div className="space-y-4">
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                                    {MEASUREMENT_TEMPLATES[m.type]?.map((field) => (
                                                                        <div key={field.key}>
                                                                            <label className="text-xs text-muted-foreground">{field.label}</label>
                                                                            <Input
                                                                                className="h-8 text-sm bg-background"
                                                                                defaultValue={m.data?.[field.key] || ""}
                                                                                onChange={(e) => {
                                                                                    setEditingMeasurement(prev => ({
                                                                                        ...prev,
                                                                                        tempMeasurements: {
                                                                                            ...prev.tempMeasurements,
                                                                                            [field.key]: e.target.value
                                                                                        }
                                                                                    }));
                                                                                }}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                                <div className="flex gap-2 justify-end">
                                                                    <Button variant="ghost" size="sm" onClick={() => setEditingMeasurement(null)}>
                                                                        <X className="mr-1 h-3 w-3" /> Cancel
                                                                    </Button>
                                                                    <Button size="sm" onClick={() => {
                                                                        customerCtrl.handlers.updateMeasurement(m.id, {
                                                                            type: m.type,
                                                                            measurement: { ...m.data, ...editingMeasurement.tempMeasurements }
                                                                        });
                                                                        setEditingMeasurement(null);
                                                                    }}>
                                                                        <Check className="mr-1 h-3 w-3" /> Update
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            /* VIEW MODE */
                                                            <>
                                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 mb-3">
                                                                    {MEASUREMENT_TEMPLATES[m.type] ? (
                                                                        MEASUREMENT_TEMPLATES[m.type].map((field) => (
                                                                            <div key={field.key} className="flex justify-between border-b border-border/40 pb-1">
                                                                                <span className="text-xs text-muted-foreground">{field.label}</span>
                                                                                <span className="text-sm font-medium">{m.data?.[field.key] || "-"}</span>
                                                                            </div>
                                                                        ))
                                                                    ) : (
                                                                        // Fallback for unknown types
                                                                        Object.entries(m.data || {}).map(([k, v]) => (
                                                                            <div key={k} className="flex justify-between border-b border-border/40 pb-1">
                                                                                <span className="text-xs text-muted-foreground capitalize">{k}</span>
                                                                                <span className="text-sm font-medium">{v}</span>
                                                                            </div>
                                                                        ))
                                                                    )}
                                                                </div>

                                                                <div className="flex gap-2 justify-end pt-2">
                                                                    <Button variant="ghost" size="sm" onClick={() => setEditingMeasurement({ ...m, tempMeasurements: {} })}>
                                                                        <Edit2 className="mr-1 h-3 w-3" /> Edit
                                                                    </Button>
                                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handlers.deleteMeasurement(m.id)}>
                                                                        <Trash2 className="mr-1 h-3 w-3" /> Delete
                                                                    </Button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ul>
                            ) : (
                                !isAddingMeasurement && <p className="text-sm text-muted-foreground text-center py-4">No measurements saved.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
