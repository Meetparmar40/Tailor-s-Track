import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner, SpinnerContainer } from "@/components/ui/spinner";
import { ShoppingBag, Edit, Trash2, Check, X, Plus } from "lucide-react";
import { format } from "date-fns";
import { tagConfig } from "./constants";

const safeFormatDate = (value, fallback = "Not set") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return format(date, "PPP");
};

export default function OrdersTabContent({
  localOrder,
  customerOrders,
  loadingOrders,
  editingOrderId,
  orderCardFormData,
  onEditOrder,
  onSaveOrder,
  onCancelOrder,
  onDeleteOrder,
  onInputChange,
  onCreateNew
}) {
  return (
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
          <Button onClick={onCreateNew} size="sm">
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
        ) : customerOrders.length > 0 || localOrder ? (
          <div className="space-y-4">
            {/* Current order if in order context */}
            {localOrder && (
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
                      onClick={() => onEditOrder(localOrder)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteOrder(localOrder.id, localOrder.customer_name)}
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
                            onValueChange={(value) => onInputChange(order.id, "type", value)}
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
                            onChange={(e) => onInputChange(order.id, "quantity", parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => onSaveOrder(order.id)}>
                          <Check className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onCancelOrder(order.id)}>
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
                          onClick={() => onEditOrder(order)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeleteOrder(order.id, `${order.quantity} ${order.type}`)}
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
  );
}
