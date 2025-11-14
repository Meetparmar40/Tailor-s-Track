import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, Mail, MapPin, Edit, Trash2, UserX } from "lucide-react";
import CustomerSelector from "./CustomerSelector";

export default function CustomerInformationCard({
  isEditing,
  isCreating,
  mode,
  isOrderContext,
  isCustomerContext,
  customerFormData,
  onInputChange,
  onEdit,
  onDelete,
  onRemove,
  // For customer selector in createOrder mode
  customers,
  selectedCustomerId,
  onCustomerSelect,
  openCustomerCombo,
  onOpenCustomerCombo,
  customerSearch,
  onCustomerSearchChange
}) {
  return (
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
            {mode === "createOrder" && (
              <CustomerSelector
                customers={customers}
                selectedCustomerId={selectedCustomerId}
                onSelect={onCustomerSelect}
                open={openCustomerCombo}
                onOpenChange={onOpenCustomerCombo}
                searchValue={customerSearch}
                onSearchChange={onCustomerSearchChange}
              />
            )}
            {!isCreating && isCustomerContext && (
              <Button
                variant="destructive"
                size="sm"
                onClick={onDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Customer
              </Button>
            )}
            {!isCreating && isOrderContext && selectedCustomerId && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRemove}
              >
                <UserX className="h-4 w-4 mr-2" />
                Remove Customer
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing || isCreating ? (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={customerFormData.name}
                onChange={(e) => onInputChange("name", e.target.value)}
                placeholder="Customer name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={customerFormData.phone}
                onChange={(e) => onInputChange("phone", e.target.value)}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={customerFormData.email}
                onChange={(e) => onInputChange("email", e.target.value)}
                placeholder="Email address"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={customerFormData.address}
                onChange={(e) => onInputChange("address", e.target.value)}
                placeholder="Address"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={customerFormData.notes}
                onChange={(e) => onInputChange("notes", e.target.value)}
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
  );
}
