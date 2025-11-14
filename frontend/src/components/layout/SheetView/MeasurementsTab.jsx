import React from "react";
import MeasurementsTabContent from "./MeasurementsTabContent";

export default function MeasurementsTab({ controller }) {
  const { state, handlers } = controller;

  return (
    <MeasurementsTabContent
      measurements={controller.measurementsStore.measurements}
      loadingMeasurements={state.loadingMeasurements}
      isEditingMeasurement={state.editing.measurement}
      creatingNewMeasurement={state.creating.newMeasurement}
      measurementFormData={state.measurementForm}
      onInputChange={handlers.handleMeasurementInputChange}
      onEdit={() => handlers.setEditing({ measurement: true })}
      onCreateNew={() => handlers.setCreating({ newMeasurement: true })}
      onDelete={(id, type) => handlers.openDeleteConfirmation("measurement", id, type)}
    />
  );
}
