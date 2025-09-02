import kurtaSvg from '../assets/icons/kurta.svg';
import suitSvg from '../assets/icons/suit.svg';

export default function OrderCardDashboard({ id, name, date, orders, tag }) {
    const formatDate = (d) =>
      new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  
    const typeToIcon = {
      shirt: "👔",
      pants: "👖",
      suit: <img src={suitSvg} alt="suit" className="w-4 h-4" />,
      kurta: <img src={kurtaSvg} alt="kurta" className="w-4 h-4" />,
      safari: "🧥",
      pyjama: "🩳",
    };
    const tagConfig = [
      { name: "In Progress", bgColor: "bg-blue-100", textColor: "text-blue-700" },
      { name: "Urgent", bgColor: "bg-red-100", textColor: "text-red-600" },
      { name: "Repair", bgColor: "bg-yellow-100", textColor: "text-yellow-700" },
      { name: "Done", bgColor: "bg-green-100", textColor: "text-green-700" }
    ];

    const getIconNodeForType = (type) => {
      if (!type) return <span>🧵</span>;
      const key = String(type).toLowerCase().trim();
      const node = typeToIcon[key];
      if (!node) return <span>🧵</span>;
      return typeof node === 'string' ? <span>{node}</span> : node;
    };

    const visibleOrders = orders.slice(0, 3); // show first 3
    const hiddenCount = orders.length - visibleOrders.length;
  
    return (
      <div className="bg-white rounded-lg shadow-md p-4 grid grid-rows-[auto,1fr,auto] w-full h-48 hover:shadow-lg transition kanban-kard">
        {/* Header */}
        <div className="flex justify-between">
          <h2 className="font-bold text-lg">{name}</h2>
          <span className="text-sm text-gray-500">{formatDate(date)}</span>
        </div>
    
          {/* Body */}
          <div className="bg-gray-50 rounded-md p-2 mt-2 relative overflow-hidden">
            <div className="flex flex-wrap gap-2 h-[4.5rem] overflow-hidden">
              {visibleOrders.map((o, i) => (
                <span
                  key={i}
                  className="bg-white border text-gray-700 text-xs px-2 py-1 rounded-full shadow-sm flex items-center gap-1 h-8"
                >
                  {getIconNodeForType(o.type)}
                  {o.type} × {o.quantity}
                </span>
              ))}
            </div>

            {hiddenCount > 0 && (
              <span className="absolute bottom-2 right-2 text-xs m-2 text-blue-600 cursor-pointer">
                +{hiddenCount} more
              </span>
            )}
          </div>

  
        {/* Footer Tags */}
        <div className="flex gap-2 mt-2">
          {tagConfig[tag] && (
            <span className={`${tagConfig[tag].bgColor} ${tagConfig[tag].textColor} text-xs px-2 py-1 rounded`}>
              {tagConfig[tag].name}
            </span>
          )}
        </div>
      </div>
    );
  }
