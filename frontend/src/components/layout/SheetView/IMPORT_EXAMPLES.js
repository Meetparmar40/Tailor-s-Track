/**
 * SheetView Component Import Examples
 * 
 * This file demonstrates different ways to import and use
 * the refactored SheetView components
 */

// ============================================
// Method 1: Import main component only (recommended)
// ============================================
import SheetView from '@/components/layout/SheetView';

// Use in your component
function MyComponent() {
  return (
    <SheetView 
      order={selectedOrder}
      open={isOpen}
      onOpenChange={setIsOpen}
      mode="view"
    />
  );
}

// ============================================
// Method 2: Import sub-components individually
// ============================================
import CustomerSelector from '@/components/layout/SheetView/CustomerSelector';
import DeleteConfirmationDialog from '@/components/layout/SheetView/DeleteConfirmationDialog';

// Use sub-components in other parts of your app
function AnotherComponent() {
  return (
    <CustomerSelector
      customers={customers}
      selectedCustomerId={selectedId}
      onSelect={handleSelect}
      open={isOpen}
      onOpenChange={setIsOpen}
      searchValue={search}
      onSearchChange={setSearch}
    />
  );
}

// ============================================
// Method 3: Import from barrel export
// ============================================
import {
  CustomerSelector,
  DeleteConfirmationDialog,
  tagConfig,
  measurementTemplates
} from '@/components/layout/SheetView';

// Use constants
const newTag = tagConfig[0]; // { name: "New", color: "text-chart-2", bg: "bg-accent" }
const shirtTemplate = measurementTemplates.shirt; // { chest: "", waist: "", ... }

// ============================================
// Method 4: Import only constants
// ============================================
import { tagConfig, measurementTemplates } from '@/components/layout/SheetView/constants';

// Use in utility functions
function getTagName(tagId) {
  return tagConfig[tagId]?.name || 'Unknown';
}

function getMeasurementFields(garmentType) {
  return Object.keys(measurementTemplates[garmentType] || {});
}

// ============================================
// Complete Usage Example
// ============================================
import { useState } from 'react';
import SheetView from '@/components/layout/SheetView';
import { tagConfig } from '@/components/layout/SheetView/constants';

function OrderManagement() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [mode, setMode] = useState('view');

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setMode('view');
    setIsOpen(true);
  };

  const handleCreateOrder = () => {
    setSelectedOrder(null);
    setMode('createOrder');
    setIsOpen(true);
  };

  const handleCreateCustomer = () => {
    setSelectedOrder(null);
    setMode('createCustomer');
    setIsOpen(true);
  };

  return (
    <div>
      <button onClick={handleCreateOrder}>New Order</button>
      <button onClick={handleCreateCustomer}>New Customer</button>

      <SheetView
        order={selectedOrder}
        open={isOpen}
        onOpenChange={setIsOpen}
        mode={mode}
        defaultTag={tagConfig[0]} // "New" tag
      />
    </div>
  );
}

export default OrderManagement;
