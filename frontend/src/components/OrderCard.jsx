import React from 'react';
import kurtaSvg from '../assets/icons/kurta.svg';
import suitSvg from '../assets/icons/suit.svg';
import shirtSvg from '../assets/icons/shirt.svg';
import pantSvg from '../assets/icons/pant.svg';
import clothesSvg from '../assets/icons/clothes.svg';

export default function OrderCard({ 
  id, 
  customer_name, 
  order_date, 
  type, 
  quantity, 
  tag, 
  notes, 
  onClick 
}) {
  
  // --- Helpers ---
  const formatDate = (d) => {
    if (!d) return "No Date";
    const dateObj = new Date(d);
    const today = new Date();
    // Reset hours for accurate day comparison
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(dateObj);
    compareDate.setHours(0, 0, 0, 0);

    const diffTime = compareDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow"; 
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)}d ago`;
    if (diffDays < 7) return `${diffDays}d left`;
    
    return dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getInitials = (name) => {
    if (!name || typeof name !== 'string') return '??';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const isOverdue = () => {
    if (!order_date) return false;
    const dateObj = new Date(order_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dateObj.setHours(0, 0, 0, 0);
    
    const diffTime = today - dateObj;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 3 && tag !== 3; // tag 3 is "Done"
  };

  // --- Configuration ---
  const typeToIcon = {
    shirt: shirtSvg,
    pants: pantSvg,
    suit: suitSvg,
    kurta: kurtaSvg,
    safari: clothesSvg,
    pyjama: clothesSvg,
  };

  const getIconForType = (type) => {
    if (!type) return clothesSvg;
    const key = String(type).toLowerCase().trim();
    return typeToIcon[key] || clothesSvg;
  };

  // Updated Professional Color Palette
  const priorityConfig = {
    0: { name: "New", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-100"},
    1: { name: "Urgent", color: "text-red-700", bg: "bg-red-50", border: "border-red-100"},
    2: { name: "Repair", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-100"},
    3: { name: "Done", color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100"}
  };

  const status = priorityConfig[tag] || { name: "Unknown", color: "text-muted-foreground", bg: "bg-muted", border: "border-border"};
  const isLate = isOverdue();

  return (
    <div 
      onClick={onClick}
      className="group relative bg-card border border-border rounded-lg p-3 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer flex flex-col gap-3"
    >
      {/* Top Row: User & Status */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-3 overflow-hidden">
          {/* Avatar */}
          <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ring-1 ring-primary/10">
            {getInitials(customer_name)}
          </div>
          
          {/* Customer Name */}
          <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {customer_name}
          </h3>
        </div>

        {/* Status Pill */}
        <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide ${status.bg} ${status.color} ${status.border} border`}>
          {status.name}
        </div>
      </div>

      {/* Middle Row: Order Details */}
      <div className="bg-muted/30 rounded-md p-2 flex items-center gap-3 border border-border/40">
        <div className="p-1.5 bg-background rounded-md shadow-sm border border-border/50">
           <img 
            src={getIconForType(type)} 
            alt={type}
            className="w-5 h-5 opacity-80"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium leading-none capitalize">
             {quantity} {type || 'Item'}
          </span>
          {notes && (
            <span className="text-xs text-muted-foreground line-clamp-1 mt-1">
              {notes}
            </span>
          )}
        </div>
      </div>

      {/* Footer: Date & ID */}
      <div className="flex items-center justify-between pt-1 mt-auto">
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-full ${isLate ? 'bg-destructive/10 text-destructive' : 'bg-transparent text-muted-foreground'}`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{formatDate(order_date)}</span>
        </div>

        {/* Subtle ID or Arrow for indication */}
         <svg className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary/60 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
      </div>
    </div>
  );
}