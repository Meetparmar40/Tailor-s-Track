import React, { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Edit2, Check, X, ChevronDown, ChevronUp, PlusCircle } from "lucide-react";

import useOrderSheetController from "./controllers/useOrderSheetController";
import SectionCard from "./ui/SectionCard";
import CustomerMiniCard from "./ui/CustomerMiniCard";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MEASUREMENT_TEMPLATES, CLOTH_TYPES } from "./measurementTemplates.js";

export default function OrderSheetView({ order, open, onOpenChange, defaultTag = 0 }) {
  const ctrl = useOrderSheetController({ order, defaultTag, onClose: () => onOpenChange(false) });
  const { state, handlers, isSaving, displayName } = ctrl;

  const [editingOrder, setEditingOrder] = useState(false);
  const [expandedMeasurementId, setExpandedMeasurementId] = useState(null);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [isAddingMeasurement, setIsAddingMeasurement] = useState(false);
  const [measureType, setMeasureType] = useState(CLOTH_TYPES.SHIRT);
  const [measureValues, setMeasureValues] = useState({});

  const orderMeasurements = ctrl.measurementsStore.measurements?.filter(
    m => m.type === state.order?.type
  ) || [];

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
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:w-[600px] md:w-[800px] lg:w-[1000px] overflow-y-auto" >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-primary">{displayName}</h3>
                <p className="text-sm text-muted-foreground">Order details</p>
              </div>

              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handlers.openDeleteConfirmation("order", state.order?.id, state.order?.customer_name)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-1 h-3 w-3" /> Delete
                </Button>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-4">
                <SectionCard title="Order Summary" subtitle="Primary information about this order">
                  {!editingOrder ? (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Type</p>
                          <p className="font-medium text-primary">{state.order?.type || state.orderForm.type || "—"}</p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="font-medium">{state.order?.quantity ?? state.orderForm.quantity}</p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="font-medium">{state.order?.status || state.orderForm.status || "not set"}</p>
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground">Due date</p>
                          <p className="font-medium">
                            {state.order?.due_date ? new Date(state.order.due_date).toLocaleDateString() : (state.orderForm.due_date || "not set")}
                          </p>
                        </div>

                        <div className="md:col-span-2">
                          <p className="text-xs text-muted-foreground">Notes</p>
                          <p className="prose max-w-none text-sm">{state.order?.notes || state.orderForm.notes || "—"}</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button variant="ghost" size="sm" onClick={() => setEditingOrder(true)}>
                          <Edit2 className="mr-2 h-3 w-3" /> Edit Order
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Type</p>
                          <Input
                            value={state.orderForm.type}
                            onChange={(e) => handlers.setOrderForm({ type: e.target.value })}
                            placeholder="Order type"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                          <Input
                            type="number"
                            value={state.orderForm.quantity}
                            onChange={(e) => handlers.setOrderForm({ quantity: parseInt(e.target.value) })}
                            placeholder="Quantity"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Status</p>
                          <Input
                            value={state.orderForm.status}
                            onChange={(e) => handlers.setOrderForm({ status: e.target.value })}
                            placeholder="Status"
                          />
                        </div>

                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Due date</p>
                          <Input
                            type="date"
                            value={state.orderForm.due_date}
                            onChange={(e) => handlers.setOrderForm({ due_date: e.target.value })}
                          />
                        </div>

                        <div className="md:col-span-2">
                          <p className="text-xs text-muted-foreground mb-1">Notes</p>
                          <Textarea
                            value={state.orderForm.notes}
                            onChange={(e) => handlers.setOrderForm({ notes: e.target.value })}
                            placeholder="Order notes"
                            className="min-h-20"
                          />
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={() => {
                            handlers.handleSaveAll();
                            setEditingOrder(false);
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
                            setEditingOrder(false);
                          }}
                        >
                          <X className="mr-2 h-3 w-3" /> Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </SectionCard>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-md font-semibold">Measurements</h4>
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

                  <div className="bg-muted/30 rounded-lg p-4 max-h-[500px] overflow-y-auto border border-muted/50">
                    
                    {/* ADD NEW MEASUREMENT FORM */}
                    {isAddingMeasurement && (
                      <div className="mb-3 bg-background rounded-md border border-border p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-sm font-semibold">Add New Measurement</p>
                          <Select value={measureType} onValueChange={(val) => {
                            setMeasureType(val);
                            setMeasureValues({});
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
                            ctrl.handlers.createMeasurement({
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
                    {ctrl.measurementsStore.measurements?.length ? (
                      <ul className="space-y-2">
                        {ctrl.measurementsStore.measurements.map((m) => {
                          const isEditing = editingMeasurement?.id === m.id;

                          return (
                          <li key={m.id} className="bg-background/60 rounded-md border border-border overflow-hidden">
                            
                            {/* Measurement Header (Click to Expand) */}
                            <div 
                              className="flex items-center justify-between gap-4 p-3 cursor-pointer hover:bg-muted/20 transition-colors"
                              onClick={() => {
                                if(!isEditing) setExpandedMeasurementId(expandedMeasurementId === m.id ? null : m.id)
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
                                         ctrl.handlers.updateMeasurement(m.id, {
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
                        )})}
                      </ul>
                    ) : (
                      !isAddingMeasurement && <p className="text-sm text-muted-foreground text-center py-4">No measurements saved.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Right column: customer mini */}
              <aside className="space-y-4">
                <CustomerMiniCard
                  customer={state.customerFromStore}
                  fallbackName={state.order?.customer_name}
                  onOpenFull={() => handlers.openCustomerSheet(state.order?.customer_id)}
                />
              </aside>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
