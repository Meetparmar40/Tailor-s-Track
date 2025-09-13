import kurtaSvg from '../assets/icons/kurta.svg';
import suitSvg from '../assets/icons/suit.svg';
import shirtSvg from '../assets/icons/shirt.svg';
import pantSvg from '../assets/icons/pant.svg';
import clothesSvg from '../assets/icons/clothes.svg';

export default function OrderCard({ id, customer_name, order_date, type, quantity, tag, notes, onClick }) {
  const formatDate = (d) => {
    const dateObj = new Date(d);
    const today = new Date();
    const diffTime = today - dateObj;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday"; 
    if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
    if (diffDays < 7) return `${diffDays}d left`;
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

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

  const totalItems = quantity;

  // Generate initials from name
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if order is overdue
  const isOverdue = () => {
    const dateObj = new Date(order_date);
    const today = new Date();
    return dateObj < today && tag !== 3;
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:bg-slate-100 transition-all duration-200 cursor-pointer group min-h-[180px] flex flex-col relative"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {/* Customer Avatar */}
          <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
            {getInitials(customer_name)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-gray-900 truncate group-hover:text-gray-700 transition-colors">
              {customer_name}
            </h3>
            <p className="text-sm text-gray-500">#{id}</p>
          </div>
        </div>
        
        {/* Status Badge */}
        <span className={`${priorityConfig[tag]?.bg || 'bg-gray-50'} ${priorityConfig[tag]?.color || 'text-gray-600'} text-xs px-2 py-1 rounded-full font-semibold flex-shrink-0 ml-2`}>
          {priorityConfig[tag]?.name || 'Unknown'}
        </span>
      </div>

      {/* Order Items Preview */}
      <div className="flex-1 mb-3 min-h-0">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
            <img 
              src={getIconForType(type)} 
              alt={type}
              className="w-4 h-4 opacity-70"
            />
            <span className="text-xs text-gray-600 font-medium">×{quantity}</span>
          </div>
        </div>
        
        {/* Total Items */}
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <span>{totalItems} items</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        {/* Due Date */}
        <div className={`flex items-center gap-1 text-xs font-medium ${
          isOverdue() ? 'text-red-600' : 'text-gray-600'
        }`}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="truncate">{formatDate(order_date)}</span>
        </div>
      </div>

      {/* Hover Effect Indicator */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gray-300 transition-all duration-200 pointer-events-none"></div>
    </div>
  );
}