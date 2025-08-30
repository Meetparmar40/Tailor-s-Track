import React from 'react';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-black">Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track all your orders</p>
      </div>
      
      {/* Main Content Area */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order List</h2>
          <p className="text-gray-600">No orders yet. Orders will appear here when they are created.</p>
        </div>
      </div>
    </div>
  );
}