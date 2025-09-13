import { useState } from 'react';
import kurtaSvg from '../assets/icons/kurta.svg';
import suitSvg from '../assets/icons/suit.svg';
import shirtSvg from '../assets/icons/shirt.svg';
import pantSvg from '../assets/icons/pant.svg';
import clothesSvg from '../assets/icons/clothes.svg';

export default function OrderDetailPanel({ order, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');

  if (!order) return null;

  const typeToIcon = {
    shirt: shirtSvg,
    pants: pantSvg,
    suit: suitSvg,
    kurta: kurtaSvg,
    safari: clothesSvg,
    pyjama: clothesSvg,
  };

  const priorityConfig = {
    0: { name: "New", color: "text-blue-600", bg: "bg-blue-50" },
    1: { name: "Urgent", color: "text-red-600", bg: "bg-red-50" },
    2: { name: "Repair", color: "text-orange-600", bg: "bg-orange-50" },
    3: { name: "Done", color: "text-green-600", bg: "bg-green-50" }
  };

  const getIconForType = (type) => {
    if (!type) return clothesSvg;
    const key = String(type).toLowerCase().trim();
    return typeToIcon[key] || clothesSvg;
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (d) => {
    return new Date(d).toLocaleDateString("en-US", { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalItems = order.orders.reduce((sum, item) => sum + item.quantity, 0);

  // Mock data for demonstration - you can replace with actual data
  const mockMeasurements = {
    shirt: { chest: "42", waist: "36", shoulder: "18", length: "30" },
    pants: { waist: "34", length: "42", hip: "40", thigh: "22" },
    suit: { chest: "42", waist: "36", shoulder: "18", length: "30" },
    kurta: { chest: "44", length: "48", shoulder: "19" }
  };

  const mockActivities = [
    { time: "2 hours ago", action: "Order status updated to In Progress", user: "John Tailor" },
    { time: "1 day ago", action: "Measurements recorded", user: "System" },
    { time: "2 days ago", action: "Order created", user: "Customer" }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose}></div>
      
      {/* Panel */}
      <div className="relative bg-white w-96 h-full shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold">
                {getInitials(order.name)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{order.name}</h2>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status and Date */}
          <div className="flex items-center gap-4 mt-4">
            <span className={`${priorityConfig[order.tag]?.bg || 'bg-gray-50'} ${priorityConfig[order.tag]?.color || 'text-gray-600'} text-sm px-3 py-1 rounded-full font-semibold`}>
              {priorityConfig[order.tag]?.name || 'Unknown'}
            </span>
            <span className="text-sm text-gray-600">Due: {formatDate(order.date)}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'measurements', label: 'Measurements' },
            { key: 'activity', label: 'Activity' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.orders.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img 
                          src={getIconForType(item.type)} 
                          alt={item.type}
                          className="w-8 h-8"
                        />
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{item.type}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">₹{(item.quantity * 500).toLocaleString()}</p>
                        <p className="text-sm text-gray-500">₹500 each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900">Total Items: {totalItems}</p>
                    <p className="text-sm text-gray-500">Total Amount</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{(totalItems * 500).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Name</span>
                    <span className="font-medium text-gray-900">{order.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Phone</span>
                    <span className="font-medium text-gray-900">+91 98765 43210</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Email</span>
                    <span className="font-medium text-gray-900">{order.name.toLowerCase().replace(' ', '.')}@email.com</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'measurements' && (
            <div className="p-6 space-y-6">
              <h3 className="font-semibold text-gray-900 mb-4">Measurements</h3>
              {order.orders.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={getIconForType(item.type)} 
                      alt={item.type}
                      className="w-6 h-6"
                    />
                    <h4 className="font-medium text-gray-900 capitalize">{item.type}</h4>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {mockMeasurements[item.type] && Object.entries(mockMeasurements[item.type]).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500 capitalize">{key}</span>
                        <span className="font-medium text-gray-900">{value}"</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {mockActivities.map((activity, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{activity.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">{activity.time}</span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{activity.user}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}