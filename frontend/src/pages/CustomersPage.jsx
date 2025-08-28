import React from 'react';
import { useCustomersStore } from '../store/useCustomersStore.js';
import { useEffect } from 'react';


// Header Component
function CustomersHeader({ onAddCustomer, total, active }) {

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex flex-col gap-2">
      {/* Top Row */}
      <div className="flex items-center justify-between">
        {/* Left: Title */}
        <h1 className="text-2xl font-bold text-black">Customers</h1>

        {/* Middle: Search */}
        <div className="flex-1 mx-6 max-w-md">
          <input
            type="text"
            placeholder="Search by name or phone…"
            className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Right: Add Button */}
        <button
          onClick={onAddCustomer}
          className="bg-black text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
        >
          + Add Customer
        </button>
      </div>

      {/* Bottom Row: Stats */}
      <div className="text-sm text-gray-500">
        Total Customers: <span className="font-medium text-black">{total}</span> | Active this month:{" "}
        <span className="font-medium text-black">{active}</span>
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const { customers, fetchCustomers, fetchMoreCustomers, loading, error, hasMore } = useCustomersStore();

  useEffect(() => {
    fetchCustomers({ limit: 10 });
  }, [fetchCustomers]);

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const total = customers.length;
  const active = customers.filter(c => {
    if (!c.created_at) return false;
    const created = new Date(c.created_at);
    return created.getMonth() === currentMonth && created.getFullYear() === currentYear;
  }).length;
  const handleAddCustomer = () => {
    // TODO: Implement add customer functionality
    console.log('Add customer clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomersHeader 
        total={total}
        active={active}
        onAddCustomer={handleAddCustomer}
      />
      
      {/* Main Content Area */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer List</h2>
          {error && (
            <div className="text-red-600 mb-3">{error}</div>
          )}
          {customers.length === 0 && !loading && !error && (
            <p className="text-gray-600">No customers yet.</p>
          )}
          <ul className="divide-y divide-gray-200">
            {customers.map((c) => (
              <li key={c.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.phone || 'No phone'}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {c.created_at ? new Date(c.created_at).toLocaleDateString() : ''}
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              onClick={() => fetchMoreCustomers({ limit: 10 })}
              disabled={!hasMore || loading}
              className={`px-4 py-2 rounded ${(!hasMore || loading) ? 'bg-gray-200 text-gray-500' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              {loading ? 'Loading…' : hasMore ? 'Load more' : 'No more'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
  