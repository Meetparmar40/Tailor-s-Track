import { useState } from "react";
import CustomerCard from "./CustomerCard";

export default function MobileViewHome({userName, orders = []}) {
  const [activeTab, setActiveTab] = useState(0); // 0=new, 1=urgent, 2=repair, 3=done


  const tabs = [
    { label: "New", tag: 0 },
    { label: "Urgent", tag: 1 },
    { label: "Repair", tag: 2 },
    { label: "Done", tag: 3 },
  ];

  return (
    <div className="px-4">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto sticky top-[64px] bg-gray-50 py-2 z-10">
        {tabs.map((t, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition whitespace-nowrap
              ${activeTab === idx
                ? "bg-black text-white border-black"
                : "bg-white text-gray-600 border-gray-300 hover:border-black"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Orders */}
      <div className="mt-4 space-y-4 pb-6">
        {orders
          .filter((o) => o.tag === tabs[activeTab].tag)
          .map((o) => (
            <CustomerCard key={o.id} {...o} />
          ))}

        {/* Empty state */}
        {orders.filter((o) => o.tag === tabs[activeTab].tag).length === 0 && (
          <p className="text-center text-gray-500 text-sm mt-8">
            No {tabs[activeTab].label.toLowerCase()} orders
          </p>
        )}
      </div>
    </div>
  );
}
