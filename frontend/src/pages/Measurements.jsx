import React from 'react';
import Header from "@/components/header"

export default function Measurements() {
  return (
    <div className="mx-8 my-2">
      {/* Header */}
      <Header />
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