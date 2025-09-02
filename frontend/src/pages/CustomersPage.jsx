import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useCustomersStore } from '../store/useCustomersStore.js';

// Utility function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
};

// Utility function to get time
const formatTime = (dateString) => {
  return new Date(dateString).toLocaleTimeString('en-IN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });
};

// Group customers by date
const groupCustomersByDate = (customers) => {
  return customers.reduce((groups, customer) => {
    const date = new Date(customer.created_at).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(customer);
    return groups;
  }, {});
};

// Get initials from name
const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

// Header Component
function CustomersHeader({ onAddCustomer, totalCustomers, monthlyOrders }) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-6">
      {/* Top Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Left: Title */}
        <div>
          <h1 className="text-3xl font-bold text-black">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customer database</p>
        </div>
        
        {/* Middle: Search */}
        <div className="flex-1 mx-8 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-10 text-sm focus:outline-none focus:border-black transition-colors"
            />
            <svg className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        {/* Right: Add Button */}
        <button
          onClick={onAddCustomer}
          className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 flex items-center space-x-2 shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Customer</span>
        </button>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-2xl font-bold text-black">{totalCustomers}</h3>
          <p className="text-sm text-gray-600">Total Customers</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-2xl font-bold text-black">{monthlyOrders}</h3>
          <p className="text-sm text-gray-600">Orders This Month</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-2xl font-bold text-black">85%</h3>
          <p className="text-sm text-gray-600">Return Rate</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-2xl font-bold text-black">4.8</h3>
          <p className="text-sm text-gray-600">Avg Rating</p>
        </div>
      </div>
    </div>
  );
}

// Customer Card Component
function CustomerCard({ customer, onCustomerClick }) {
  return (
    <div 
      onClick={() => onCustomerClick(customer)}
      className="bg-white rounded-xl p-6 border border-gray-200 hover:border-black hover:shadow-xl transition-all duration-300 cursor-pointer group"
    >
      <div className="flex items-start justify-between">
        {/* Left: Customer Info */}
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-black text-white rounded-xl flex items-center justify-center font-bold text-lg group-hover:bg-gray-800 transition-colors">
            {getInitials(customer.name)}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg group-hover:text-black">{customer.name}</h4>
            <p className="text-gray-600">{customer.phone || 'No phone number'}</p>
            {customer.notes && (
              <p className="text-sm text-gray-500 mt-1 max-w-xs truncate">{customer.notes}</p>
            )}
          </div>
        </div>
        
        {/* Right: Stats & Time */}
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-2">{formatTime(customer.created_at)}</div>
          <div className="flex space-x-3">
            <div className="text-center">
              <div className="text-lg font-bold text-black">{customer.current_orders || 0}</div>
              <div className="text-xs text-gray-500">Current</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-black">{customer.total_monthly_orders || 0}</div>
              <div className="text-xs text-gray-500">This Month</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom: Quick Actions Hint */}
      <div className="mt-4 pt-4 border-t border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Click to view details</span>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// Date Section Component
function DateSection({ date, customers, onCustomerClick }) {
  const customerCount = customers.length;
  const isToday = formatDate(customers[0].created_at) === 'Today';
  
  return (
    <div className="mb-8">
      {/* Date Header */}
      <div className={`sticky top-0 z-10 px-6 py-4 rounded-xl mb-6 shadow-lg ${
        isToday ? 'bg-black text-white' : 'bg-white text-black border-2 border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold">{formatDate(customers[0].created_at)}</h3>
            <p className={`text-sm ${isToday ? 'text-gray-300' : 'text-gray-600'}`}>
              {customerCount} customer{customerCount !== 1 ? 's' : ''} added
            </p>
          </div>
          {isToday && (
            <div className="bg-white bg-opacity-20 rounded-full px-3 py-1">
              <span className="text-sm font-medium">New</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Customer Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {customers.map((customer) => (
          <CustomerCard 
            key={customer.id} 
            customer={customer} 
            onCustomerClick={onCustomerClick}
          />
        ))}
      </div>
    </div>
  );
}

export default function CustomersPage() {
  const { customers, fetchCustomers, fetchMoreCustomers, loading, error, hasMore } = useCustomersStore();
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const observerRef = useRef();
  const lastElementRef = useRef();

  // Initial fetch
  useEffect(() => {
    fetchCustomers({ limit: 10 });
  }, [fetchCustomers]);

  // Infinite scroll implementation
  const lastElementCallback = useCallback(node => {
    if (loading) return;
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchMoreCustomers({ limit: 10 });
      }
    }, {
      rootMargin: '200px'
    });
    
    if (node) observerRef.current.observe(node);
  }, [loading, hasMore, fetchMoreCustomers]);

  // Group customers by date
  const groupedCustomers = groupCustomersByDate(customers);
  const sortedDates = Object.keys(groupedCustomers).sort((a, b) => new Date(b) - new Date(a));

  // Calculate stats
  const totalCustomers = customers.length;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const monthlyOrders = customers.reduce((total, customer) => {
    const customerDate = new Date(customer.created_at);
    if (customerDate.getMonth() === currentMonth && customerDate.getFullYear() === currentYear) {
      return total + (customer.total_monthly_orders || 0);
    }
    return total;
  }, 0);

  const handleAddCustomer = () => {
    console.log('Add customer clicked');
    // TODO: Implement add customer modal/page
  };

  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
    console.log('Customer clicked:', customer);
    // TODO: Navigate to customer details page or open modal
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomersHeader 
        totalCustomers={totalCustomers}
        monthlyOrders={monthlyOrders}
        onAddCustomer={handleAddCustomer}
      />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {customers.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No customers yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first customer</p>
            <button
              onClick={handleAddCustomer}
              className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
            >
              Add Your First Customer
            </button>
          </div>
        )}

        {/* Customer Sections by Date */}
        {sortedDates.map((date, dateIndex) => {
          const isLastSection = dateIndex === sortedDates.length - 1;
          const sectionCustomers = groupedCustomers[date];
          
          return (
            <div key={date} className="mb-8">
              <DateSection 
                date={date}
                customers={sectionCustomers}
                onCustomerClick={handleCustomerClick}
              />
              
              {/* Attach observer to last customer of last section */}
              {isLastSection && (
                <div ref={lastElementCallback} className="h-1"></div>
              )}
            </div>
          );
        })}

        {/* Loading States */}
        {loading && customers.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-3 bg-white rounded-xl px-6 py-4 shadow-lg">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-black border-t-transparent"></div>
              <span className="text-gray-700 font-medium">Loading more customers...</span>
            </div>
          </div>
        )}

        {loading && customers.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-flex items-center space-x-3 bg-white rounded-xl px-8 py-6 shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
              <span className="text-gray-700 font-medium text-lg">Loading customers...</span>
            </div>
          </div>
        )}

        {/* End of List */}
        {!hasMore && customers.length > 0 && (
          <div className="text-center py-8">
            <div className="inline-flex items-center space-x-2 bg-gray-100 rounded-xl px-6 py-3">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-gray-600 font-medium">You've seen all customers</span>
            </div>
          </div>
        )}

        {/* Customer Detail Preview (for demo) */}
        {selectedCustomer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setSelectedCustomer(null)}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Customer Details</h3>
                <button 
                  onClick={() => setSelectedCustomer(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-black text-white rounded-2xl flex items-center justify-center font-bold text-2xl mx-auto mb-4">
                  {getInitials(selectedCustomer.name)}
                </div>
                <h4 className="text-xl font-bold text-gray-900">{selectedCustomer.name}</h4>
                <p className="text-gray-600">{selectedCustomer.phone}</p>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-900 mb-2">Order Summary</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Current Orders:</span>
                      <span className="font-medium text-black ml-2">{selectedCustomer.current_orders || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Monthly Orders:</span>
                      <span className="font-medium text-black ml-2">{selectedCustomer.total_monthly_orders || 0}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition-colors">
                  View Full Details & Measurements
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}