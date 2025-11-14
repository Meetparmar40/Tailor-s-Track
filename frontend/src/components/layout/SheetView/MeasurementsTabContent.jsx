import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner, SpinnerContainer } from "@/components/ui/spinner";
import { Ruler, Edit, Trash2, Plus } from "lucide-react";
import { measurementTemplates } from "./constants";

export default function MeasurementsTabContent({
  measurements,
  loadingMeasurements,
  isEditingMeasurement,
  creatingNewMeasurement,
  measurementFormData,
  onInputChange,
  onEdit,
  onCreateNew,
  onDelete
}) {
  return (
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
                  onClick={onEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button onClick={onCreateNew} size="sm">
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
                      onValueChange={(value) => onInputChange("type", value)}
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
                            onChange={(e) => onInputChange(field, e.target.value)}
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
                        onClick={() => onDelete(measurement.id, measurement.type)}
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
                  onClick={onCreateNew}
                >
                  Add Measurements
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
