import React, { useState, useEffect } from 'react';
import { X, User, Ruler, Package, Calendar, Clock, Phone, FileText, Edit3, Plus } from 'lucide-react';
import { useOrdersStore } from '../store/useOrdersStore.js';
import { useMeasurementsStore } from '../store/useMeasurementsStore.js';

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'bg-green-100 text-green-800';
    case 'in_progress': return 'bg-yellow-100 text-yellow-800';
    case 'pending': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'completed': return '✓';
    case 'in_progress': return '⟳';
    case 'pending': return '⏸';
    default: return '○';
  }
};

const MeasurementCard = ({ measurement, onEdit }) => {
  const measurementLabels = {
    shirt: ['Chest', 'Waist', 'Shoulder', 'Sleeve', 'Length'],
    pants: ['Waist', 'Length', 'Thigh', 'Knee', 'Bottom'],
    blazer: ['Chest', 'Waist', 'Shoulder', 'Sleeve', 'Length']
  };
  const labels = measurementLabels[measurement.type] || Object.keys(measurement.data);

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-black transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 capitalize">{measurement.type}</h4>
            <p className="text-sm text-gray-500">Last updated {formatDate(measurement.updated_at)}</p>
          </div>
        </div>
        <button
          onClick={() => onEdit(measurement)}
          className="p-2 text-gray-400 hover:text-black hover:bg-white rounded-lg transition-colors"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(measurement.data).map(([key, value], index) => (
          <div key={key} className="bg-white rounded-lg p-3 border border-gray-100">
            <div className="text-xs text-gray-500 uppercase tracking-wide">
              {labels[index] || key}
            </div>
            <div className="text-lg font-bold text-black">{value}"</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const OrderCard = ({ order }) => {
  const { orders, fetchOrdersOfCustomer, ordersLoading, error: ordersError } = useOrdersStore();

  useEffect(() => {
    fetchOrdersOfCustomer(order.customer_id);
  }, [fetchOrdersOfCustomer]);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:border-black transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 capitalize">{order.type}</h4>
            <p className="text-sm text-gray-500">Quantity: {order.quantity}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
            <span>{getStatusIcon(order.status)}</span>
            <span className="capitalize">{order.status.replace('_', ' ')}</span>
          </div>
          <div className="text-xs text-gray-500 mt-1">Tag #{order.tag}</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          Ordered on {formatDate(order.order_date)}
        </div>
        {order.notes && (
          <div className="flex items-start text-sm text-gray-600">
            <FileText className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
            <span>{order.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon: Icon, label, count }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all ${
      active 
        ? 'bg-black text-white shadow-lg' 
        : 'text-gray-600 hover:text-black hover:bg-gray-100'
    }`}
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
    {count !== undefined && (
      <span className={`px-2 py-1 rounded-full text-xs ${
        active ? 'bg-white bg-opacity-20' : 'bg-gray-200 text-gray-700'
      }`}>
        {count}
      </span>
    )}
  </button>
);

export default function CustomerDetailsModal({ customer, onClose, onEdit }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [customerDetails, setCustomerDetails] = useState(null);
  const { orders, fetchOrdersOfCustomer,  ordersLoading, error: ordersError } = useOrdersStore();
  const [loading, setLoading] = useState(true);
  const { measurements, fetchMeasurementsOfCustomer, loading: measurementsLoading, error: measurementsError } = useMeasurementsStore();

  useEffect(() => {
    if (customer) {
      const fetchCustomerDetails = async () => {
        try {
          setLoading(true);
          await Promise.all([
            fetchOrdersOfCustomer(customer.id),
            fetchMeasurementsOfCustomer(customer.id)
          ]);
          
          setCustomerDetails(customer);
        } catch (error) {
          console.error('Error fetching customer details:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchCustomerDetails();
    }
  }, [customer, fetchOrdersOfCustomer, fetchMeasurementsOfCustomer]);

  if (!customer) return null;

  const handleEditMeasurement = (measurement) => {
    console.log('Edit measurement:', measurement);
  };

  const handleAddMeasurement = () => {
    console.log('Add new measurement');
  };

  const currentOrders = orders?.filter(order => order.status === 'in_progress') || [];
  const completedOrders = orders?.filter(order => order.status === 'completed') || [];
  const lastPurchaseDate = orders?.length > 0 
    ? orders.sort((a, b) => new Date(b.order_date) - new Date(a.order_date))[0].order_date
    : null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Customer Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center font-bold text-2xl">
              {getInitials(customer.name)}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{customer.name}</h3>
              <div className="flex items-center space-x-4 mt-2 text-gray-200">
                <div className="flex items-center space-x-1">
                  <Phone className="w-4 h-4" />
                  <span>{customer.phone || 'No phone'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{customer.gender === 0 ? 'Male' : 'Female'}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(customer.created_at)}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{currentOrders.length}</div>
                <div className="text-xs text-gray-300">Current Orders</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{orders?.length || 0}</div>
                <div className="text-xs text-gray-300">Total Orders</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{measurements?.length || 0}</div>
                <div className="text-xs text-gray-300">Measurements</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex space-x-2">
            <TabButton
              active={activeTab === 'overview'}
              onClick={() => setActiveTab('overview')}
              icon={User}
              label="Overview"
            />
            <TabButton
              active={activeTab === 'measurements'}
              onClick={() => setActiveTab('measurements')}
              icon={Ruler}
              label="Measurements"
              count={measurements?.length}
            />
            <TabButton
              active={activeTab === 'orders'}
              onClick={() => setActiveTab('orders')}
              icon={Package}
              label="Orders"
              count={orders?.length}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-black border-t-transparent"></div>
              <span className="ml-3 text-gray-600">Loading customer details...</span>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-green-800 font-semibold">Current Orders</h4>
                          <div className="text-2xl font-bold text-green-900 mt-1">{currentOrders.length}</div>
                        </div>
                        <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-green-700" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-blue-800 font-semibold">Last Purchase</h4>
                          <div className="text-sm font-bold text-blue-900 mt-1">
                            {lastPurchaseDate ? formatDate(lastPurchaseDate) : 'No purchases'}
                          </div>
                        </div>
                        <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-blue-700" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-purple-800 font-semibold">Measurements</h4>
                          <div className="text-2xl font-bold text-purple-900 mt-1">{measurements?.length || 0}</div>
                        </div>
                        <div className="w-12 h-12 bg-purple-200 rounded-xl flex items-center justify-center">
                          <Ruler className="w-6 h-6 text-purple-700" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {customer.notes && (
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h4 className="font-bold text-gray-900 mb-3">Customer Notes</h4>
                      <p className="text-gray-700">{customer.notes}</p>
                    </div>
                  )}

                  {/* Recent Orders */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900">Recent Orders</h4>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-sm text-black hover:underline"
                      >
                        View all →
                      </button>
                    </div>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Measurements Tab */}
              {activeTab === 'measurements' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900">Customer Measurements</h4>
                    <button
                      onClick={handleAddMeasurement}
                      className="bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Measurement</span>
                    </button>
                  </div>
                  
                  {measurements.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {measurements.map((measurement) => (
                        <MeasurementCard
                          key={measurement.id}
                          measurement={measurement}
                          onEdit={handleEditMeasurement}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ruler className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No measurements yet</h3>
                      <p className="text-gray-600 mb-4">Add the first measurement to get started</p>
                      <button
                        onClick={handleAddMeasurement}
                        className="bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors"
                      >
                        Add First Measurement
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Orders Tab */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900">Order History</h4>
                    <div className="flex space-x-2">
                      <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option>All Status</option>
                        <option>In Progress</option>
                        <option>Completed</option>
                        <option>Pending</option>
                      </select>
                    </div>
                  </div>
                  
                    {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders
                        .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
                        .map((order) => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600">This customer hasn't placed any orders</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 border-t px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Customer since {formatDate(customer.created_at)}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => onEdit && onEdit(customer)}
                className="bg-black text-white px-6 py-2 rounded-xl hover:bg-gray-800 transition-colors flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Customer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}