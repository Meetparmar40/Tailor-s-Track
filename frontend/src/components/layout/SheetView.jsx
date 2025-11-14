import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import SheetViewHeader from "./SheetView/SheetViewHeader";
import DetailsTab from "./SheetView/DetailsTab";
import OrdersTab from "./SheetView/OrdersTab";
import MeasurementsTab from "./SheetView/MeasurementsTab";
import DeleteConfirmationDialog from "./SheetView/DeleteConfirmationDialog";

import useSheetViewController from "./SheetView/useSheetViewController";

export default function SheetView({
  order,
  customer,
  open,
  onOpenChange,
  mode = "view",
  defaultTag = 0,
}) {
  const controller = useSheetViewController({
    order,
    customer,
    mode,
    defaultTag,
    onClose: () => onOpenChange(false),
  });

  const {
    displayName,
    isCreating,
    isOrderContext,
    selectedTag,
    isSavingTag,
    isAnyEditing,
    isSaving,
    handlers,
    state,
  } = controller;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:w-[1000px] lg:w-[1500px] overflow-y-auto pt-16">
          <SheetViewHeader
            displayName={displayName}
            isCreating={isCreating}
            isOrderContext={isOrderContext}
            mode={mode}
            selectedTag={selectedTag}
            onTagChange={handlers.handleTagChange}
            isSavingTag={isSavingTag}
            onEditTag={() => handlers.setEditingTag(true)}
            isEditingTag={state.editing.tag}
          />

          <Separator className="my-6" />

          {isAnyEditing && (
            <div className="flex gap-2 mb-4">
              <button
                onClick={handlers.handleSaveAll}
                className="btn btn-primary flex-1"
                disabled={isSaving}
              >
                {isSaving ? "Please wait..." : "Save All Changes"}
              </button>
              <button
                onClick={handlers.handleCancelAll}
                className="btn btn-outline"
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}

          <Tabs defaultValue="details" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="measurements">Measurements</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6">
              <DetailsTab controller={controller} />
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <OrdersTab controller={controller} />
            </TabsContent>

            <TabsContent value="measurements" className="space-y-6">
              <MeasurementsTab controller={controller} />
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <DeleteConfirmationDialog
        open={state.deleteConfirmation.open}
        onOpenChange={(openFlag) =>
          handlers.setDeleteConfirmation({
            ...state.deleteConfirmation,
            open: openFlag,
          })
        }
        title={state.deleteConfirmation.title}
        description={state.deleteConfirmation.description}
        onConfirm={handlers.handleConfirmDelete}
        onCancel={() =>
          handlers.setDeleteConfirmation({
            open: false,
            type: null,
            id: null,
            title: "",
            description: "",
          })
        }
      />
    </>
  );
}
