// Order status options with internal values and display labels
export const ORDER_STATUSES = {
  NEW: "new",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  ON_HOLD: "on_hold",
  CANCELLED: "cancelled",
};

// Map internal status values to display labels
export const STATUS_DISPLAY_LABELS = {
  [ORDER_STATUSES.NEW]: "New",
  [ORDER_STATUSES.IN_PROGRESS]: "In Progress",
  [ORDER_STATUSES.COMPLETED]: "Completed",
  [ORDER_STATUSES.ON_HOLD]: "On Hold",
  [ORDER_STATUSES.CANCELLED]: "Cancelled",
};

// Get display label for a status
export const getStatusDisplayLabel = (status) => {
  if (!status) return "Not Set";
  return STATUS_DISPLAY_LABELS[status] || status;
};

// Tag configurations for Kanban columns
export const TAG_CONFIG = {
  0: { 
    key: 0, 
    name: "New", 
    status: ORDER_STATUSES.NEW,
  },
  1: { 
    key: 1, 
    name: "Urgent", 
    status: ORDER_STATUSES.IN_PROGRESS,
  },
  2: { 
    key: 2, 
    name: "Repair", 
    status: ORDER_STATUSES.IN_PROGRESS,
  },
  3: { 
    key: 3, 
    name: "Done", 
    status: ORDER_STATUSES.COMPLETED,
  }
};

// Tag to status mapping for kanban columns
export const TAG_TO_STATUS = {
  0: ORDER_STATUSES.NEW,
  1: ORDER_STATUSES.IN_PROGRESS,
  2: ORDER_STATUSES.IN_PROGRESS,
  3: ORDER_STATUSES.COMPLETED,
};

// Get default status based on tag
export const getStatusFromTag = (tag) => {
  return TAG_TO_STATUS[tag] || ORDER_STATUSES.IN_PROGRESS;
};

// Order type options
export const ORDER_TYPES = {
  PANT: "pant",
  SHIRT: "shirt",
  SUIT: "suit",
  KURTA: "kurta",
  SALVAAR: "salvaar",
  BLOUSE: "blouse",
  OTHER: "other",
};

// Get display label for order type (capitalize first letter)
export const getTypeDisplayLabel = (type) => {
  if (!type) return "Not Set";
  return type.charAt(0).toUpperCase() + type.slice(1);
};