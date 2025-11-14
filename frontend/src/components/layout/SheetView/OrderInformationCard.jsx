import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Package, Calendar, Clock, Hash, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";

const safeFormatDate = (value, fallback = "Not set") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return format(date, "PPP");
};

export default function OrderInformationCard({
  isEditing,
  isCreating,
  orderFormData,
  onInputChange,
  onEdit,
  onDelete
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Order Information
            </CardTitle>
            <CardDescription>
              {isCreating ? "Enter order details" : "Order specifics and requirements"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!isEditing && !isCreating && (
              <Button
                variant="outline"
                size="sm"
                onClick={onEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {!isCreating && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Order
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing || isCreating ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Garment Type</Label>
              <Select value={orderFormData.type} onValueChange={(value) => onInputChange("type", value)}>
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
                onChange={(e) => onInputChange("quantity", parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={orderFormData.status}
                onChange={(e) => onInputChange("status", e.target.value)}
                placeholder="Order status"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date</Label>
              <Input
                id="due_date"
                type="date"
                value={orderFormData.due_date}
                onChange={(e) => onInputChange("due_date", e.target.value)}
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="order_notes">Order Notes</Label>
              <Textarea
                id="order_notes"
                value={orderFormData.notes}
                onChange={(e) => onInputChange("notes", e.target.value)}
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
  );
}
